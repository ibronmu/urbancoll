import { User } from '../models'; // Assuming User model is defined in models/index.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
    async createUser(data: any) {
        return await prisma.user.create({
            data,
        });
    }

    async getUserById(id: string) {
        return await prisma.user.findUnique({
            where: { id },
        });
    }

    async updateUser(id: string, data: any) {
        return await prisma.user.update({
            where: { id },
            data,
        });
    }

    async deleteUser(id: string) {
        return await prisma.user.delete({
            where: { id },
        });
    }

    async getAllUsers() {
        return await prisma.user.findMany();
    }
}