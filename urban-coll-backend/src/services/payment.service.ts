import { Injectable } from 'nestjs/common';
import axios from 'axios';
import { PaystackResponse } from '../types/index.d';

@Injectable()
export class PaymentService {
    private readonly paystackUrl = 'https://api.paystack.co';
    private readonly secretKey = process.env.PAYSTACK_SECRET_KEY;

    constructor() {
        if (!this.secretKey) {
            throw new Error('Paystack secret key is not defined in environment variables');
        }
    }

    async initializePayment(amount: number, email: string): Promise<PaystackResponse> {
        const response = await axios.post(`${this.paystackUrl}/transaction/initialize`, {
            amount,
            email,
        }, {
            headers: {
                Authorization: `Bearer ${this.secretKey}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    }

    async verifyPayment(reference: string): Promise<PaystackResponse> {
        const response = await axios.get(`${this.paystackUrl}/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${this.secretKey}`,
            },
        });

        return response.data;
    }
}