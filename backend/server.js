import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import productRoute from "./routes/products.routes.js";
import cartRoute from "./routes/cart.routes.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT;
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectDB();
});
