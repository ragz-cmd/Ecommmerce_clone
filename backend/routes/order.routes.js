import express from "express";
import { getOrderById } from "../controllers/order.controller.js";

const router = express.Router();

// Route to get order by Razorpay order ID
router.get("/:orderId", getOrderById);

export default router;
