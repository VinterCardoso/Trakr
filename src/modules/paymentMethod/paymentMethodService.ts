import { PaymentMethod } from "@prisma/client";
import {
  PaymentMethodCreateInput,
  PaymentMethodUpdateInput,
} from "./paymentMethod.dto";
import prisma from "src/infra/database";

export class PaymentMethodService {
  async createPaymentMethod(
    data: PaymentMethodCreateInput
  ): Promise<PaymentMethod> {
    return await prisma.paymentMethod.create({
      data,
    });
  }

  async getPaymentMethod(id: number): Promise<PaymentMethod | null> {
    return await prisma.paymentMethod.findUnique({
      where: { id },
    });
  }

  async updatePaymentMethod(
    id: number,
    data: PaymentMethodUpdateInput
  ): Promise<PaymentMethod | null> {
    return await prisma.paymentMethod.update({
      where: { id },
      data,
    });
  }

  async deletePaymentMethod(id: number): Promise<PaymentMethod | null> {
    return await prisma.paymentMethod.delete({
      where: { id },
    });
  }
}
