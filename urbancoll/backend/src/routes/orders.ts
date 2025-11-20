import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../utils/jwt";

const prisma = new PrismaClient();
const router = express.Router();

// Create an order: expects items = [{ productId, quantity }]
router.post("/", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "Missing token" });
  const token = auth.replace(/^Bearer\s+/i, "");
  const payload = verifyToken(token) as any;
  if (!payload) return res.status(401).json({ message: "Invalid token" });

  const { items } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ message: "items required" });

  // Load product details and compute total
  const productIds = items.map((i: any) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  if (products.length !== productIds.length) return res.status(400).json({ message: "Some products not found" });

  let total = 0;
  const orderItemsData: any[] = [];
  for (const it of items) {
    const p = products.find((x) => x.id === it.productId)!;
    if (p.stock < it.quantity) return res.status(400).json({ message: `Insufficient stock for ${p.name}` });
    total += p.price * it.quantity;
    orderItemsData.push({ productId: p.id, quantity: it.quantity, price: p.price });
  }

  const order = await prisma.order.create({ data: { customerId: payload.userId, total, status: "PENDING" } });

  // create order items
  for (const oi of orderItemsData) {
    await prisma.orderItem.create({ data: { orderId: order.id, productId: oi.productId, quantity: oi.quantity, price: oi.price } });
    // decrement stock
    await prisma.product.update({ where: { id: oi.productId }, data: { stock: { decrement: oi.quantity } } as any });
  }

  res.status(201).json({ data: order });
});

router.get("/", async (req, res) => {
  // list orders for authenticated user
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "Missing token" });
  const token = auth.replace(/^Bearer\s+/i, "");
  const payload = verifyToken(token) as any;
  if (!payload) return res.status(401).json({ message: "Invalid token" });
  const orders = await prisma.order.findMany({ where: { customerId: payload.userId }, include: { items: true, payment: true } });
  res.json({ data: orders });
});

export default router;
