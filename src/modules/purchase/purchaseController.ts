import { Request, Response } from "express";
import { PurchaseService } from "./purchaseService";
import { Prisma } from "@prisma/client";

export class PurchaseController {
  private purchaseService: PurchaseService;

  constructor() {
    this.purchaseService = new PurchaseService();
  }

  /**
   * Rota para buscar todas as compras.
   */
  async getAllPurchases(req: Request, res: Response): Promise<void> {
    try {
      const purchases = await this.purchaseService.findAll();
      res.status(200).json(purchases);
    } catch (error: any) {
      console.error("Erro ao buscar todas as compras:", error);
      res
        .status(500)
        .json({ message: "Falha ao buscar as compras.", error: error.message });
    }
  }

  /**
   * Rota para buscar uma compra pelo ID.
   */
  async getPurchaseById(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: "ID da compra inválido." });
      return;
    }

    try {
      const purchase = await this.purchaseService.findById(id);
      if (purchase) {
        res.status(200).json(purchase);
      } else {
        res.status(404).json({ message: "Compra não encontrada." });
      }
    } catch (error: any) {
      console.error(`Erro ao buscar compra com ID ${id}:`, error);
      res
        .status(500)
        .json({ message: "Falha ao buscar a compra.", error: error.message });
    }
  }

  /**
   * Rota para criar uma nova compra.
   */
  async createPurchase(req: Request, res: Response): Promise<void> {
    const {
      purchaseDate,
      totalValue,
      userId,
      purchaseLocationId,
      expenses,
      purchasePaymentMethods,
    } = req.body;

    // Validação básica dos campos obrigatórios
    if (
      !purchaseDate ||
      totalValue === undefined ||
      !userId ||
      !purchaseLocationId ||
      !expenses ||
      !purchasePaymentMethods
    ) {
      res
        .status(400)
        .json({
          message:
            "Campos obrigatórios ausentes. Verifique a documentação da API.",
        });
      return;
    }

    try {
      const newPurchase = await this.purchaseService.create(req.body);
      res.status(201).json(newPurchase);
    } catch (error: any) {
      console.error("Erro ao criar a compra:", error);
      res
        .status(500)
        .json({ message: "Falha ao criar a compra.", error: error.message });
    }
  }

  /**
   * Rota para atualizar uma compra existente.
   */
  async updatePurchase(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: "ID da compra inválido." });
      return;
    }

    const purchaseDataToUpdate = req.body;
    if (Object.keys(purchaseDataToUpdate).length === 0) {
      res
        .status(400)
        .json({ message: "Nenhum dado fornecido para atualização." });
      return;
    }

    try {
      const updatedPurchase = await this.purchaseService.update(
        id,
        purchaseDataToUpdate
      );
      res.status(200).json(updatedPurchase);
    } catch (error: any) {
      console.error(`Erro ao atualizar a compra com ID ${id}:`, error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        res.status(404).json({ message: "Compra não encontrada." });
      } else {
        res
          .status(500)
          .json({
            message: "Falha ao atualizar a compra.",
            error: error.message,
          });
      }
    }
  }

  /**
   * Rota para excluir uma compra.
   */
  async deletePurchase(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: "ID da compra inválido." });
      return;
    }

    try {
      const isDeleted = await this.purchaseService.delete(id);
      if (isDeleted) {
        res.status(204).send(); // Sucesso, sem conteúdo
      } else {
        // Isso pode acontecer se o service retornar false porque a compra não foi encontrada.
        res.status(404).json({ message: "Compra não encontrada." });
      }
    } catch (error: any) {
      console.error(`Erro ao excluir a compra com ID ${id}:`, error);
      res
        .status(500)
        .json({ message: "Falha ao excluir a compra.", error: error.message });
    }
  }
}
