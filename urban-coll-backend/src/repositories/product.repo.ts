import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductRepository {
    async createProduct(data) {
        return await prisma.product.create({
            data,
        });
    }

    async getProductById(id) {
        return await prisma.product.findUnique({
            where: { id },
        });
    }

    async updateProduct(id, data) {
        return await prisma.product.update({
            where: { id },
            data,
        });
    }

    async deleteProduct(id) {
        return await prisma.product.delete({
            where: { id },
        });
    }

    async getAllProducts() {
        return await prisma.product.findMany();
    }
}