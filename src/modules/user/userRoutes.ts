import { Router } from "express";
import { UserController } from "./userController";

const userRoutes = Router();
const userController = new UserController();

userRoutes.get("/", userController.getAllUsers.bind(userController));
userRoutes.get("/:id", userController.getUserById.bind(userController));
userRoutes.post("/", userController.createUser.bind(userController));
userRoutes.put("/:id", userController.updateUser.bind(userController));
userRoutes.delete("/:id", userController.deleteUser.bind(userController));

export default userRoutes;
