import { Router } from "express";
import { PurchaseController } from "./purchaseController";

const purchaseRoutes = Router();
const purchaseController = new PurchaseController();

purchaseRoutes.get("/", (req, res) =>
  purchaseController.getAllPurchases(req, res)
);
purchaseRoutes.get("/:id", (req, res) =>
  purchaseController.getPurchaseById(req, res)
);
purchaseRoutes.post("/", (req, res) =>
  purchaseController.createPurchase(req, res)
);
purchaseRoutes.put("/:id", (req, res) =>
  purchaseController.updatePurchase(req, res)
);
purchaseRoutes.delete("/:id", (req, res) =>
  purchaseController.deletePurchase(req, res)
);

export default purchaseRoutes;
