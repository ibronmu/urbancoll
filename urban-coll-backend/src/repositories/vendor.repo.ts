import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class VendorRepository {
    async createVendor(data) {
        return await prisma.vendor.create({
            data,
        });
    }

    async getVendorById(id) {
        return await prisma.vendor.findUnique({
            where: { id },
        });
    }

    async updateVendor(id, data) {
        return await prisma.vendor.update({
            where: { id },
            data,
        });
    }

    async deleteVendor(id) {
        return await prisma.vendor.delete({
            where: { id },
        });
    }

    async getAllVendors() {
        return await prisma.vendor.findMany();
    }
}