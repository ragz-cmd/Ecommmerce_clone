import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import productRoute from "./routes/products.routes.js";
import cartRoute from "./routes/cart.routes.js";
import checkoutRoute from "./routes/payment.routes.js";
import couponRoute from "./routes/coupon.routes.js";
import analyticRoute from "./routes/analytic.routes.js";
import orderRoute from "./routes/order.routes.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));

app.use(
  cors({
    origin: "http://localhost:3000", // Allow only your frontend origin
    credentials: true, // Allow cookies or credentials
  })
);

const PORT = process.env.PORT;
app.options(
  "*",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/checkout", checkoutRoute);
app.use("/api/coupons", couponRoute);
app.use("/api/analytics", analyticRoute);
app.use("/api/order", orderRoute);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectDB();
});
