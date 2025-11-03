import { OrderRepository } from '../repositories/order.repo';
import { ProductRepository } from '../repositories/product.repo';
import { UserRepository } from '../repositories/user.repo';

export class OrderService {
    private orderRepo: OrderRepository;
    private productRepo: ProductRepository;
    private userRepo: UserRepository;

    constructor() {
        this.orderRepo = new OrderRepository();
        this.productRepo = new ProductRepository();
        this.userRepo = new UserRepository();
    }

    async createOrder(userId: string, productId: string, quantity: number) {
        const product = await this.productRepo.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        const order = {
            userId,
            productId,
            quantity,
            totalAmount: product.price * quantity,
            status: 'pending',
        };

        return this.orderRepo.create(order);
    }

    async getOrderById(orderId: string) {
        return this.orderRepo.findById(orderId);
    }

    async getUserOrders(userId: string) {
        return this.orderRepo.findByUserId(userId);
    }

    async updateOrderStatus(orderId: string, status: string) {
        return this.orderRepo.updateStatus(orderId, status);
    }
}