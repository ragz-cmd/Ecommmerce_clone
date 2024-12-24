import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";

import { checkoutService } from "../controllers/checkout.controllers.js";
const router = express.Router();

router.post("/", protectRoute, checkoutService);

export default router;
