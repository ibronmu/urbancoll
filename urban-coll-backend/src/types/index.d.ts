export interface User {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Vendor {
    id: string;
    name: string;
    description: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    vendorId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Order {
    id: string;
    userId: string;
    productId: string;
    quantity: number;
    totalAmount: number;
    status: 'pending' | 'completed' | 'canceled';
    createdAt: Date;
    updatedAt: Date;
}

export interface Payment {
    id: string;
    orderId: string;
    amount: number;
    status: 'pending' | 'successful' | 'failed';
    createdAt: Date;
    updatedAt: Date;
}

export interface Admin {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}