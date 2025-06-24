import { Request, Response } from "express";
import { UserService } from "./userService";

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.userService.findAll();
            res.status(200).json(users);
        } catch (error: any) {
            console.error("Error fetching all users:", error);
            res.status(500).json({ message: "Failed to retrieve users.", error: error.message });
        }
    }

    async getUserById(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid user ID provided." });
            return;
        }

        try {
            const user = await this.userService.findById(id);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: "User not found." });
            }
        } catch (error: any) {
            console.error(`Error fetching user with ID ${id}:`, error);
            res.status(500).json({ message: "Failed to retrieve user.", error: error.message });
        }
    }

    async createUser(req: Request, res: Response): Promise<void> {
        const { name, password, email } = req.body;
        if (!name || !password || !email) {
            res.status(400).json({ message: "Missing required fields: name, password, and email are required." });
            return;
        }

        try {
            const newUser = await this.userService.create({ name, password, email });
            res.status(201).json(newUser);
        } catch (error: any) {
            console.error("Error creating user:", error);
            if (error.message.includes("exists")) {
                res.status(409).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Failed to create user.", error: error.message });
            }
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid user ID provided." });
            return;
        }

        const userDataToUpdate = req.body;
        if (Object.keys(userDataToUpdate).length === 0) {
            res.status(400).json({ message: "No data provided for update." });
            return;
        }

        try {
            const updatedUser = await this.userService.update(id, userDataToUpdate);
            res.status(200).json(updatedUser);
        } catch (error: any) {
            console.error(`Error updating user with ID ${id}:`, error);
            if (error.message.includes("not found")) {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Failed to update user.", error: error.message });
            }
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid user ID provided." });
            return;
        }

        try {
            const isDeleted = await this.userService.delete(id);
            if (isDeleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: "User not found." });
            }
        } catch (error: any) {
            console.error(`Error deleting user with ID ${id}:`, error);
            res.status(500).json({ message: "Failed to delete user.", error: error.message });
        }
    }
}
