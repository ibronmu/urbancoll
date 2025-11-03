import { Router } from 'express';
import authRoutes from './auth.routes';
import vendorRoutes from './vendor.routes';
import productRoutes from './product.routes';
import orderRoutes from './order.routes';
import paymentRoutes from './payment.routes';
import adminRoutes from './admin.routes';

const router = Router();

const setupRoutes = (app) => {
    app.use('/api/auth', authRoutes);
    app.use('/api/vendors', vendorRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/payments', paymentRoutes);
    app.use('/api/admin', adminRoutes);
};

export default setupRoutes;