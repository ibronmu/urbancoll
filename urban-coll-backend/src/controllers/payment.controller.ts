import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';

export class PaymentController {
    private paymentService: PaymentService;

    constructor() {
        this.paymentService = new PaymentService();
    }

    public async initiatePayment(req: Request, res: Response): Promise<Response> {
        try {
            const { amount, email } = req.body;
            const paymentUrl = await this.paymentService.createPayment(amount, email);
            return res.status(200).json({ paymentUrl });
        } catch (error) {
            return res.status(500).json({ message: 'Payment initiation failed', error: error.message });
        }
    }

    public async verifyPayment(req: Request, res: Response): Promise<Response> {
        try {
            const { reference } = req.params;
            const verificationResult = await this.paymentService.verifyPayment(reference);
            return res.status(200).json(verificationResult);
        } catch (error) {
            return res.status(500).json({ message: 'Payment verification failed', error: error.message });
        }
    }
}