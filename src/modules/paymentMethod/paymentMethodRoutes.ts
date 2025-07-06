import { Router } from "express";
import { PaymentMethodController } from "./paymentMethodController";

const paymentMethodRoutes = Router();
const paymentMethodController = new PaymentMethodController();

paymentMethodRoutes.post("/", (req, res) =>
  paymentMethodController.createPaymentMethod(req, res)
);
paymentMethodRoutes.get("/:id", (req, res) =>
  paymentMethodController.getPaymentMethod(req, res)
);
paymentMethodRoutes.put("/:id", (req, res) =>
  paymentMethodController.updatePaymentMethod(req, res)
);
paymentMethodRoutes.delete("/:id", (req, res) =>
  paymentMethodController.deletePaymentMethod(req, res)
);

export default paymentMethodRoutes;
