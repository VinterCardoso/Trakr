import { Router } from "express";
import { CategoryController } from "./categoryController";

const categoryRoutes = Router();
const categoryController = new CategoryController();

categoryRoutes.post("/", (req, res) =>
  categoryController.createCategory(req, res)
);
categoryRoutes.get("/:id", (req, res) =>
  categoryController.getCategory(req, res)
);
categoryRoutes.put("/:id", (req, res) =>
  categoryController.updateCategory(req, res)
);
categoryRoutes.delete("/:id", (req, res) =>
  categoryController.deleteCategory(req, res)
);

export default categoryRoutes;
