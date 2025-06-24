import prisma from "../../infra/database";
import { User } from "@prisma/client";

export class UserService {

    async findAll(): Promise<User[]> {
        return prisma.user.findMany();
    }

    async findById(id: number): Promise<User | null> {
        return prisma.user.findUnique({ where: { id } });
    }

    async create(userData: { name: string; password: string; email: string }): Promise<User> {
        const existingUser = await prisma.user.findUnique({ where: { email: userData.email } });
        if (existingUser) {
            throw new Error("User with this email already exists.");
        }
        return prisma.user.create({ data: userData });
    }

    async update(id: number, userData: Partial<User>): Promise<User> {
        try {
            const updatedUser = await prisma.user.update({
                where: { id },
                data: userData,
            });
            return updatedUser;
        } catch (error: any) {
            if (error.code === 'P2025') { // Prisma error code for record not found
                throw new Error("User not found.");
            }
            throw error;
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            await prisma.user.delete({ where: { id } });
            return true;
        } catch (error: any) {
            if (error.code === 'P2025') { 
                return false; 
            }
            throw error;
        }
    }
}
