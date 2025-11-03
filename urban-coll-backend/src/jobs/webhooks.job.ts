import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';

export class WebhookJob {
    private paymentService: PaymentService;

    constructor() {
        this.paymentService = new PaymentService();
    }

    public handlePaymentWebhook = async (req: Request, res: Response) => {
        const event = req.body;

        try {
            switch (event.event) {
                case 'charge.success':
                    await this.paymentService.handleSuccessfulCharge(event.data);
                    break;
                case 'charge.failed':
                    await this.paymentService.handleFailedCharge(event.data);
                    break;
                // Add more cases as needed for different events
                default:
                    console.log(`Unhandled event type: ${event.event}`);
            }
            res.status(200).send('Webhook received');
        } catch (error) {
            console.error('Error handling webhook:', error);
            res.status(500).send('Internal Server Error');
        }
    };
}