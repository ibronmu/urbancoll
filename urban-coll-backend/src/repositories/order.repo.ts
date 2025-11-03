import { Order } from '../models'; // Assuming Order model is defined in models/index.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class OrderRepository {
    async createOrder(orderData) {
        return await prisma.order.create({
            data: orderData,
        });
    }

    async getOrderById(orderId) {
        return await prisma.order.findUnique({
            where: { id: orderId },
        });
    }

    async getAllOrders() {
        return await prisma.order.findMany();
    }

    async updateOrder(orderId, updateData) {
        return await prisma.order.update({
            where: { id: orderId },
            data: updateData,
        });
    }

    async deleteOrder(orderId) {
        return await prisma.order.delete({
            where: { id: orderId },
        });
    }
}