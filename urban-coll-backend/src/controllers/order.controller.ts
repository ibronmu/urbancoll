import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';

export class OrderController {
    private orderService: OrderService;

    constructor() {
        this.orderService = new OrderService();
    }

    public async createOrder(req: Request, res: Response): Promise<Response> {
        try {
            const orderData = req.body;
            const newOrder = await this.orderService.createOrder(orderData);
            return res.status(201).json(newOrder);
        } catch (error) {
            return res.status(500).json({ message: 'Error creating order', error });
        }
    }

    public async getOrder(req: Request, res: Response): Promise<Response> {
        try {
            const orderId = req.params.id;
            const order = await this.orderService.getOrderById(orderId);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            return res.status(200).json(order);
        } catch (error) {
            return res.status(500).json({ message: 'Error retrieving order', error });
        }
    }

    public async getAllOrders(req: Request, res: Response): Promise<Response> {
        try {
            const orders = await this.orderService.getAllOrders();
            return res.status(200).json(orders);
        } catch (error) {
            return res.status(500).json({ message: 'Error retrieving orders', error });
        }
    }
}