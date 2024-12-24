import express from "express";
import {
  getCoupon,
  validateCoupon,
} from "../controllers/coupons.controller.js";

const router = express.Router();

// Get active coupon for the logged-in user
router.get("/active", getCoupon);

// Validate a coupon by code
router.post("/validate", validateCoupon);

export default router;
