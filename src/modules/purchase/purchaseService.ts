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
  /**
   * Busca todas as compras, incluindo suas despesas e métodos de pagamento associados.
   * @returns Uma promessa que resolve para um array de compras.
   */
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

  /**
   * Busca uma única compra pelo seu ID, incluindo suas despesas e métodos de pagamento.
   * @param id - O ID da compra a ser encontrada.
   * @returns Uma promessa que resolve para o objeto da compra ou null se não for encontrada.
   */
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

  /**
   * Cria uma nova compra juntamente com suas despesas e métodos de pagamento associados
   * dentro de uma única transação para garantir a consistência dos dados.
   * @param purchaseData - Os dados para a nova compra, incluindo arrays para despesas e métodos de pagamento.
   * @returns Uma promessa que resolve para a compra recém-criada.
   */
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

  /**
   * Atualiza uma compra existente, suas despesas e métodos de pagamento.
   * As despesas e métodos de pagamento existentes são removidos e recriados com base nos novos dados.
   * @param id - O ID da compra a ser atualizada.
   * @param purchaseData - Os dados a serem atualizados.
   * @returns Uma promessa que resolve para a compra atualizada.
   */
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

  /**
   * Exclui uma compra e todas as suas despesas e métodos de pagamento associados.
   * A operação é realizada em uma transação para garantir a exclusão completa.
   * @param id - O ID da compra a ser excluída.
   * @returns Uma promessa que resolve para um booleano indicando o sucesso da operação.
   */
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
