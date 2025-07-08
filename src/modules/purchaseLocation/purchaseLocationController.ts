import { Request, Response } from "express";
import { PurchaseLocationService } from "./purchaseLocationService";

export class PurchaseLocationController {
  private purchaseLocationService: PurchaseLocationService;

  constructor() {
    this.purchaseLocationService = new PurchaseLocationService();
  }


  async getAllPurchaseLocations(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const purchaseLocations =
        await this.purchaseLocationService.getAllPurchaseLocations();
      res.status(200).json(purchaseLocations);
    } catch (error: any) {
      console.error("Error fetching purchase locations:", error);
      res.status(500).json({
        message: "Failed to fetch purchase locations.",
        error: error.message,
      });
    }
  }
  
  async createPurchaseLocation(req: Request, res: Response): Promise<void> {
    const { locationName, locationType, address } = req.body;

    if (!locationName || !locationType) {
      res.status(400).json({
        message:
          "Missing required fields: locationName and locationType are required.",
      });
      return;
    }

    try {
      const purchaseLocation =
        await this.purchaseLocationService.createPurchaseLocation({
          locationName,
          locationType,
          address,
        });

      res.status(201).json(purchaseLocation);
    } catch (error: any) {
      console.error("Error creating purchase location:", error);
      res
        .status(500)
        .json({
          message: "Failed to create purchase location.",
          error: error.message,
        });
    }
  }

  async getPurchaseLocation(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res
        .status(400)
        .json({ message: "Invalid purchase location ID provided." });
      return;
    }

    try {
      const purchaseLocation =
        await this.purchaseLocationService.getPurchaseLocation(id);
      if (purchaseLocation) {
        res.status(200).json(purchaseLocation);
      } else {
        res.status(404).json({ message: "Purchase location not found." });
      }
    } catch (error: any) {
      console.error(`Error fetching purchase location with ID ${id}:`, error);
      res
        .status(500)
        .json({
          message: "Failed to retrieve purchase location.",
          error: error.message,
        });
    }
  }

  async updatePurchaseLocation(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);
    const { locationName, locationType, address } = req.body;

    if (isNaN(id)) {
      res
        .status(400)
        .json({ message: "Invalid purchase location ID provided." });
      return;
    }

    try {
      const updatedPurchaseLocation =
        await this.purchaseLocationService.updatePurchaseLocation(id, {
          locationName,
          locationType,
          address,
        });

      if (updatedPurchaseLocation) {
        res.status(200).json(updatedPurchaseLocation);
      } else {
        res.status(404).json({ message: "Purchase location not found." });
      }
    } catch (error: any) {
      console.error(`Error updating purchase location with ID ${id}:`, error);
      res
        .status(500)
        .json({
          message: "Failed to update purchase location.",
          error: error.message,
        });
    }
  }

  async deletePurchaseLocation(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res
        .status(400)
        .json({ message: "Invalid purchase location ID provided." });
      return;
    }

    try {
      const deletedPurchaseLocation =
        await this.purchaseLocationService.deletePurchaseLocation(id);
      if (deletedPurchaseLocation) {
        res.status(200).json(deletedPurchaseLocation);
      } else {
        res.status(404).json({ message: "Purchase location not found." });
      }
    } catch (error: any) {
      console.error(`Error deleting purchase location with ID ${id}:`, error);
      res
        .status(500)
        .json({
          message: "Failed to delete purchase location.",
          error: error.message,
        });
    }
  }
}
