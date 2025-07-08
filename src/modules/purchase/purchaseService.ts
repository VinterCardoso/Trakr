import prisma from "../../infra/database";
import {
  Purchase,
  Expense,
  PurchasePaymentMethod,
  Prisma,
} from "@prisma/client";

// Tipos para os dados de entrada para garantir a clareza e segurança do tipo.

// Dados necessários para criar um novo Expense. O purchaseId será adicionado pelo serviço.
type ExpenseInput = Omit<Expense, "id" | "purchaseId">;

// Dados necessários para criar um novo PurchasePaymentMethod. O purchaseId será adicionado pelo serviço.
type PurchasePaymentMethodInput = Omit<
  PurchasePaymentMethod,
  "id" | "purchaseId"
>;

// Estrutura completa dos dados para criar uma nova Purchase.
// Inclui um array de expenses e um array de métodos de pagamento.
type PurchaseCreateInput = Omit<Purchase, "id"> & {
  expenses: ExpenseInput[];
  purchasePaymentMethods: PurchasePaymentMethodInput[];
};

// Estrutura para atualizar uma Purchase. Todos os campos são parciais/opcionais.
type PurchaseUpdateInput = Partial<Omit<Purchase, "id">> & {
  expenses?: ExpenseInput[];
  purchasePaymentMethods?: PurchasePaymentMethodInput[];
};

export class PurchaseService {
  async findAll(): Promise<Purchase[]> {
    return prisma.purchase.findMany({
      include: {
        expenses: true,
        purchasePaymentMethods: true,
        purchaseLocation: true, // Inclui a localização da compra
        user: true, // Inclui o usuário
      },
    });
  }

  async findById(id: number): Promise<Purchase | null> {
    return prisma.purchase.findUnique({
      where: { id },
      include: {
        expenses: true,
        purchasePaymentMethods: {
          include: {
            paymentMethod: true, // Inclui detalhes do método de pagamento
          },
        },
        purchaseLocation: true,
        user: true,
      },
    });
  }

  async create(purchaseData: PurchaseCreateInput): Promise<Purchase> {
    const { expenses, purchasePaymentMethods, ...data } = purchaseData;

    // Utiliza uma transação para garantir que todas as operações sejam bem-sucedidas ou nenhuma delas.
    return prisma.$transaction(async (tx) => {
      // 1. Cria a entidade Purchase principal
      const newPurchase = await tx.purchase.create({
        data: data,
      });

      // 2. Cria as entidades Expense associadas
      if (expenses && expenses.length > 0) {
        await tx.expense.createMany({
          data: expenses.map((expense) => ({
            ...expense,
            purchaseId: newPurchase.id, // Associa a despesa à nova compra
          })),
        });
      }

      // 3. Cria as entidades PurchasePaymentMethod associadas
      if (purchasePaymentMethods && purchasePaymentMethods.length > 0) {
        await tx.purchasePaymentMethod.createMany({
          data: purchasePaymentMethods.map((pm) => ({
            ...pm,
            purchaseId: newPurchase.id, // Associa o método de pagamento à nova compra
          })),
        });
      }

      // Retorna a compra completa com suas relações.
      // Precisamos fazer uma nova busca aqui porque o createMany não retorna os registros criados.
      const result = await tx.purchase.findUnique({
        where: { id: newPurchase.id },
        include: {
          expenses: true,
          purchasePaymentMethods: true,
        },
      });

      if (!result) {
        // Isso não deve acontecer em uma transação bem-sucedida, mas é uma proteção.
        throw new Error("Falha ao buscar a compra recém-criada.");
      }

      return result;
    });
  }

  async update(
    id: number,
    purchaseData: PurchaseUpdateInput
  ): Promise<Purchase> {
    const { expenses, purchasePaymentMethods, ...data } = purchaseData;

    return prisma.$transaction(async (tx) => {
      // 1. Atualiza a entidade Purchase principal
      const updatedPurchase = await tx.purchase.update({
        where: { id },
        data: data,
      });

      // 2. Atualiza as despesas: remove as antigas e cria as novas
      if (expenses) {
        // Remove todas as despesas existentes para esta compra
        await tx.expense.deleteMany({ where: { purchaseId: id } });
        // Cria as novas despesas
        if (expenses.length > 0) {
          await tx.expense.createMany({
            data: expenses.map((expense) => ({
              ...expense,
              purchaseId: id,
            })),
          });
        }
      }

      // 3. Atualiza os métodos de pagamento: remove os antigos e cria os novos
      if (purchasePaymentMethods) {
        // Remove todos os métodos de pagamento existentes para esta compra
        await tx.purchasePaymentMethod.deleteMany({
          where: { purchaseId: id },
        });
        // Cria os novos métodos de pagamento
        if (purchasePaymentMethods.length > 0) {
          await tx.purchasePaymentMethod.createMany({
            data: purchasePaymentMethods.map((pm) => ({
              ...pm,
              purchaseId: id,
            })),
          });
        }
      }

      const result = await tx.purchase.findUnique({
        where: { id },
        include: {
          expenses: true,
          purchasePaymentMethods: true,
        },
      });

      if (!result) {
        throw new Error("Compra não encontrada após a atualização.");
      }

      return result;
    });
  }

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.$transaction(async (tx) => {
        // 1. Exclui as despesas associadas
        await tx.expense.deleteMany({
          where: { purchaseId: id },
        });

        // 2. Exclui os métodos de pagamento associados
        await tx.purchasePaymentMethod.deleteMany({
          where: { purchaseId: id },
        });

        // 3. Exclui a compra principal
        await tx.purchase.delete({
          where: { id },
        });
      });
      return true;
    } catch (error: any) {
      // Se o Prisma não encontrar o registro para deletar, ele lança um erro P2025.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        console.warn(
          `Tentativa de exclusão de compra não encontrada com ID: ${id}`
        );
        return false; // Retorna false se a compra não existia
      }
      // Lança outros erros para serem tratados em uma camada superior
      throw error;
    }
  }
}
