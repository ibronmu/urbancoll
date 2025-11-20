import express from "express";
import { PrismaClient } from "@prisma/client";
let StripeLib: any = null;
try {
  // require at runtime so the app can run without stripe installed (dev optional)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  StripeLib = require("stripe");
} catch (err) {
  StripeLib = null;
}

const prisma = new PrismaClient();
const router = express.Router();

const stripeSecret = process.env.STRIPE_SECRET;
const stripe = stripeSecret && StripeLib ? new StripeLib(stripeSecret, { apiVersion: "2022-11-15" }) : null;

// Create a payment record for an order. If STRIPE_SECRET is set, create a PaymentIntent and return client_secret.
router.post("/create", async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ message: "orderId required" });

  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) return res.status(404).json({ message: "Order not found" });

  const amount = Math.round(order.total * 100); // cents

  if (stripe) {
    try {
      const intent = await stripe.paymentIntents.create({ amount, currency: "usd" });
      const payment = await prisma.payment.create({ data: { orderId: order.id, provider: "stripe", providerId: intent.id, amount: order.total, captured: false } });
      return res.json({ data: { clientSecret: intent.client_secret, payment } });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Stripe error" });
    }
  }

  // Without Stripe: create a payment record marked as captured for demo purposes
  const payment = await prisma.payment.create({ data: { orderId: order.id, provider: "mock", providerId: `mock_${Date.now()}`, amount: order.total, captured: true } });
  res.json({ data: { clientSecret: null, payment } });
});

export default router;
