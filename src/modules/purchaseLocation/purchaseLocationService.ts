import { PurchaseLocation } from "@prisma/client";
import prisma from "src/infra/database";

export class PurchaseLocationService {


  async getAllPurchaseLocations(): Promise<PurchaseLocation[]> {
    return await prisma.purchaseLocation.findMany();
  }
  
  async createPurchaseLocation(data: {
    locationName: string;
    locationType: string;
    address?: string;
  }): Promise<PurchaseLocation> {
    return await prisma.purchaseLocation.create({
      data,
    });
  }

  async getPurchaseLocation(id: number): Promise<PurchaseLocation | null> {
    return await prisma.purchaseLocation.findUnique({
      where: { id },
    });
  }

  async updatePurchaseLocation(
    id: number,
    data: { locationName?: string; locationType?: string; address?: string }
  ): Promise<PurchaseLocation | null> {
    return await prisma.purchaseLocation.update({
      where: { id },
      data,
    });
  }

  async deletePurchaseLocation(id: number): Promise<PurchaseLocation | null> {
    return await prisma.purchaseLocation.delete({
      where: { id },
    });
  }
}
