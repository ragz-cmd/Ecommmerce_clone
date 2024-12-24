import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";

import {
  checkoutService,
  checkoutSuccess,
} from "../controllers/checkout.controllers.js";
const router = express.Router();

router.post("/", protectRoute, checkoutService);
router.post("/checkout-verify", checkoutSuccess);

export default router;
