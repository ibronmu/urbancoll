import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../utils/jwt";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  const items = await prisma.product.findMany({ include: { vendor: true } });
  res.json({ data: { items } });
});

router.post("/", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "Missing token" });
  const token = auth.replace(/^Bearer\s+/i, "");
  const payload = verifyToken(token) as any;
  if (!payload) return res.status(401).json({ message: "Invalid token" });

  const { name, description, price, stock, category } = req.body;
  if (!name || price == null) return res.status(400).json({ message: "name and price required" });

  // For simplicity, vendor is auto-created if user has no vendor
  let vendor = await prisma.vendor.findFirst();
  if (!vendor) {
    vendor = await prisma.vendor.create({ data: { businessName: "Default Vendor" } });
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: Number(price),
      stock: Number(stock) || 0,
      category,
      vendor: { connect: { id: vendor.id } },
    },
  });
  res.json({ data: product });
});

export default router;
