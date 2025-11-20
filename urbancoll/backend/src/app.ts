import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import vendorRoutes from "./routes/vendors";
import orderRoutes from "./routes/orders";
import paymentRoutes from "./routes/payments";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/vendors", vendorRoutes);
app.use("/orders", orderRoutes);
app.use("/payments", paymentRoutes);

app.get("/", (req, res) => res.json({ message: "ArtisanHub backend running" }));

export default app;
