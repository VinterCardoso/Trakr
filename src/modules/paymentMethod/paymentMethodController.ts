import { Request, Response } from "express";
import { PaymentMethodService } from "./paymentMethodService";

export class PaymentMethodController {
  private paymentMethodService: PaymentMethodService;

  constructor() {
    this.paymentMethodService = new PaymentMethodService();
  }

  async createPaymentMethod(req: Request, res: Response): Promise<void> {
    const { paymentMethodName, paymentMethodType } = req.body;

    if (!paymentMethodName || !paymentMethodType) {
      res
        .status(400)
        .json({
          message:
            "Missing required fields: paymentMethodName and paymentMethodType are required.",
        });
      return;
    }

    try {
      const paymentMethod = await this.paymentMethodService.createPaymentMethod(
        req.body
      );

      res.status(201).json(paymentMethod);
    } catch (error: any) {
      console.error("Error creating payment method:", error);
      res
        .status(500)
        .json({
          message: "Failed to create payment method.",
          error: error.message,
        });
    }
  }

  async getPaymentMethod(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid payment method ID provided." });
      return;
    }

    try {
      const paymentMethod = await this.paymentMethodService.getPaymentMethod(
        id
      );
      if (paymentMethod) {
        res.status(200).json(paymentMethod);
      } else {
        res.status(404).json({ message: "Payment method not found." });
      }
    } catch (error: any) {
      console.error(`Error fetching payment method with ID ${id}:`, error);
      res
        .status(500)
        .json({
          message: "Failed to retrieve payment method.",
          error: error.message,
        });
    }
  }

  async updatePaymentMethod(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid payment method ID provided." });
      return;
    }

    const { paymentMethodName, paymentMethodType } = req.body;
    if (!paymentMethodName || !paymentMethodType) {
      res
        .status(400)
        .json({
          message:
            "Missing required fields: paymentMethodName and paymentMethodType are required.",
        });
      return;
    }

    try {
      const updatedPaymentMethod =
        await this.paymentMethodService.updatePaymentMethod(id, req.body);
      if (updatedPaymentMethod) {
        res.status(200).json(updatedPaymentMethod);
      } else {
        res.status(404).json({ message: "Payment method not found." });
      }
    } catch (error: any) {
      console.error(`Error updating payment method with ID ${id}:`, error);
      res
        .status(500)
        .json({
          message: "Failed to update payment method.",
          error: error.message,
        });
    }
  }

  async deletePaymentMethod(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid payment method ID provided." });
      return;
    }

    try {
      const deletedPaymentMethod =
        await this.paymentMethodService.deletePaymentMethod(id);
      if (deletedPaymentMethod) {
        res.status(200).json(deletedPaymentMethod);
      } else {
        res.status(404).json({ message: "Payment method not found." });
      }
    } catch (error: any) {
      console.error(`Error deleting payment method with ID ${id}:`, error);
      res
        .status(500)
        .json({
          message: "Failed to delete payment method.",
          error: error.message,
        });
    }
  }
}
