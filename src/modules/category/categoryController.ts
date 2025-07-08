import { CategoryService } from "./categoryService";
import { Request, Response } from "express";

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      res
        .status(500)
        .json({ message: "Failed to fetch categories.", error: error.message });
    }
  }
  async createCategory(req: Request, res: Response): Promise<void> {
    const { categoryName, description } = req.body;

    if (!categoryName) {
      res.status(400).json({
        message: "Missing required field: categoryName is required.",
      });
      return;
    }

    try {
      const category = await this.categoryService.createCategory({
        categoryName,
        description,
      });

      res.status(201).json(category);
    } catch (error: any) {
      console.error("Error creating category:", error);
      res
        .status(500)
        .json({ message: "Failed to create category.", error: error.message });
    }
  }

  async getCategory(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid category ID provided." });
      return;
    }

    try {
      const category = await this.categoryService.getCategory(id);
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ message: "Category not found." });
      }
    } catch (error: any) {
      console.error("Error fetching category:", error);
      res
        .status(500)
        .json({ message: "Failed to fetch category.", error: error.message });
    }
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);
    const { categoryName, description } = req.body;

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid category ID provided." });
      return;
    }

    try {
      const updatedCategory = await this.categoryService.updateCategory(id, {
        categoryName,
        description,
      });

      if (updatedCategory) {
        res.status(200).json(updatedCategory);
      } else {
        res.status(404).json({ message: "Category not found." });
      }
    } catch (error: any) {
      console.error("Error updating category:", error);
      res
        .status(500)
        .json({ message: "Failed to update category.", error: error.message });
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid category ID provided." });
      return;
    }

    try {
      const deletedCategory = await this.categoryService.deleteCategory(id);
      if (deletedCategory) {
        res.status(200).json({ message: "Category deleted successfully." });
      } else {
        res.status(404).json({ message: "Category not found." });
      }
    } catch (error: any) {
      console.error("Error deleting category:", error);
      res
        .status(500)
        .json({ message: "Failed to delete category.", error: error.message });
    }
  }
}
