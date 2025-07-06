import { Category } from "@prisma/client";
import prisma from "src/infra/database";

export class CategoryService {
  async createCategory(data: {
    categoryName: string;
    description?: string;
  }): Promise<Category> {
    return await prisma.category.create({
      data,
    });
  }

  async getCategory(id: number): Promise<Category | null> {
    return await prisma.category.findUnique({
      where: { id },
    });
  }

  async updateCategory(
    id: number,
    data: { categoryName?: string; description?: string }
  ): Promise<Category | null> {
    return await prisma.category.update({
      where: { id },
      data,
    });
  }

  async deleteCategory(id: number): Promise<Category | null> {
    return await prisma.category.delete({
      where: { id },
    });
  }
}
