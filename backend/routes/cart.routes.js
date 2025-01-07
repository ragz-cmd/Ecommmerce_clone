import express from "express";
import {
  addCartItem,
  getAllCartItems,
  removeCartItem,
  updateCartItem,
} from "../controllers/cart.controllers.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getAllCartItems);
router.delete("/", protectRoute, removeCartItem);
router.post("/", protectRoute, addCartItem);
router.put("/:id", protectRoute, updateCartItem);
export default router;
