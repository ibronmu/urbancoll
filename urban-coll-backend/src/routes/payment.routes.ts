import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';

const router = Router();
const paymentController = new PaymentController();

router.post('/pay', paymentController.processPayment);
router.get('/payment-status/:reference', paymentController.getPaymentStatus);

export default router;