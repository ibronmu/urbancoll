import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';

const router = Router();
const orderController = new OrderController();

// Create a new order
router.post('/', orderController.createOrder);

// Get all orders
router.get('/', orderController.getAllOrders);

// Get a specific order by ID
router.get('/:id', orderController.getOrderById);

// Update an order by ID
router.put('/:id', orderController.updateOrder);

// Delete an order by ID
router.delete('/:id', orderController.deleteOrder);

export default router;