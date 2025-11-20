import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { signAccessToken, signRefreshToken, verifyToken } from "../utils/jwt";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;
  if (!email || !password) return res.status(400).json({ message: "email and password required" });
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        firstName,
        lastName,
        role: role ? String(role) : "CUSTOMER",
      },
    });
    const accessToken = signAccessToken({ userId: user.id, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id });
    res.json({ data: { user: { id: user.id, email: user.email, role: user.role }, accessToken, refreshToken }, message: "Registration successful" });
  } catch (err: any) {
    if (err.code === "P2002") return res.status(409).json({ message: "Email already exists" });
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "email and password required" });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user.id });
  res.json({ data: { user: { id: user.id, email: user.email, role: user.role }, accessToken, refreshToken }, message: "Login successful" });
});

router.post("/refresh", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "Missing token" });
  const token = auth.replace(/^Bearer\s+/i, "");
  const payload = verifyToken(token) as any;
  if (!payload) return res.status(401).json({ message: "Invalid token" });
  const accessToken = signAccessToken({ userId: payload.userId });
  const refreshToken = signRefreshToken({ userId: payload.userId });
  res.json({ data: { accessToken, refreshToken } });
});

router.post("/logout", async (req, res) => {
  // For stateless JWT we simply respond; to fully support logout store a revocation list.
  res.json({ message: "Logout successful" });
});

export default router;
