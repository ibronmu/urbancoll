import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Seed vendors
    const vendor1 = await prisma.vendor.create({
        data: {
            name: 'Vendor One',
            email: 'vendor1@example.com',
            phone: '1234567890',
            address: '123 Vendor St, Lagos',
        },
    });

    const vendor2 = await prisma.vendor.create({
        data: {
            name: 'Vendor Two',
            email: 'vendor2@example.com',
            phone: '0987654321',
            address: '456 Vendor Ave, Abuja',
        },
    });

    // Seed products
    await prisma.product.createMany({
        data: [
            {
                name: 'Product One',
                description: 'Description for product one',
                price: 1000,
                vendorId: vendor1.id,
            },
            {
                name: 'Product Two',
                description: 'Description for product two',
                price: 2000,
                vendorId: vendor2.id,
            },
        ],
    });

    // Seed users
    await prisma.user.create({
        data: {
            username: 'user1',
            email: 'user1@example.com',
            password: 'password123',
        },
    });

    console.log('Database seeded successfully');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });