import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import productRoute from "./routes/products.routes.js";
import cartRoute from "./routes/cart.routes.js";
import checkoutRoute from "./routes/payment.routes.js";
import couponRoute from "./routes/coupon.routes.js";
import analyticRoute from "./routes/analytic.routes.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Allow only your frontend origin
    credentials: true, // Allow cookies or credentials
  })
);

const PORT = process.env.PORT;
app.options(
  "/api/*",
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
app.use("/api/coupon", couponRoute);
app.use("/api/analytics", analyticRoute);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectDB();
});
