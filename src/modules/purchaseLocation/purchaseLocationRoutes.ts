import { Router } from "express";
import { PurchaseLocationController } from "./purchaseLocationController";

const purchaseLocationRoutes = Router();
const purchaseLocationController = new PurchaseLocationController();

purchaseLocationRoutes.get("/", (req, res) =>
  purchaseLocationController.getAllPurchaseLocations(req, res)
);
purchaseLocationRoutes.post("/", (req, res) =>
  purchaseLocationController.createPurchaseLocation(req, res)
);
purchaseLocationRoutes.get("/:id", (req, res) =>
  purchaseLocationController.getPurchaseLocation(req, res)
);
purchaseLocationRoutes.put("/:id", (req, res) =>
  purchaseLocationController.updatePurchaseLocation(req, res)
);
purchaseLocationRoutes.delete("/:id", (req, res) =>
  purchaseLocationController.deletePurchaseLocation(req, res)
);

export default purchaseLocationRoutes;
