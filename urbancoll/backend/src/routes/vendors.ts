import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../utils/jwt";

const prisma = new PrismaClient();
const router = express.Router();

// Create or update vendor profile for authenticated user
router.post("/", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "Missing token" });
  const token = auth.replace(/^Bearer\s+/i, "");
  const payload = verifyToken(token) as any;
  if (!payload) return res.status(401).json({ message: "Invalid token" });

  const { businessName, description, commission } = req.body;
  if (!businessName) return res.status(400).json({ message: "businessName required" });

  // If user already has vendor, update it
  const userId = payload.userId as string;
  let vendor = await prisma.vendor.findFirst({ where: { ownerId: userId } });
  if (vendor) {
    vendor = await prisma.vendor.update({ where: { id: vendor.id }, data: { businessName, description, commission } });
    return res.json({ data: vendor });
  }

  vendor = await prisma.vendor.create({ data: { businessName, description, commission: commission || 0.10, owner: { connect: { id: userId } } } });
  res.status(201).json({ data: vendor });
});

router.get("/me", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "Missing token" });
  const token = auth.replace(/^Bearer\s+/i, "");
  const payload = verifyToken(token) as any;
  if (!payload) return res.status(401).json({ message: "Invalid token" });
  const userId = payload.userId as string;
  const vendor = await prisma.vendor.findFirst({ where: { ownerId: userId }, include: { products: true } });
  if (!vendor) return res.status(404).json({ message: "Vendor not found" });
  res.json({ data: vendor });
});

router.get("/", async (req, res) => {
  const vendors = await prisma.vendor.findMany({ include: { products: true } });
  res.json({ data: vendors });
});

export default router;
