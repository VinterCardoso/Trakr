import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

export const initializeDatabase = async () => {
    try {
        await prisma.$connect();
        console.log("Database connection established successfully with Prisma!");
    } catch (error) {
        console.error("Error connecting to database with Prisma:", error);
        process.exit(1);
    }
};

export default prisma;
