import axios from 'axios';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export const paystackApi = axios.create({
    baseURL: 'https://api.paystack.co',
    headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
    },
});

export const initializePayment = async (amount, email) => {
    try {
        const response = await paystackApi.post('/transaction/initialize', {
            amount,
            email,
        });
        return response.data;
    } catch (error) {
        throw new Error('Payment initialization failed');
    }
};

export const verifyPayment = async (reference) => {
    try {
        const response = await paystackApi.get(`/transaction/verify/${reference}`);
        return response.data;
    } catch (error) {
        throw new Error('Payment verification failed');
    }
};