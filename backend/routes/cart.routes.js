import express from "express";
import {
  addCartItem,
  getAllCartItems,
  removeAllCartItem,
  updateCartItem,
} from "../controllers/cart.controllers";
import { protectRoute } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", protectRoute, getAllCartItems);
router.delete("/", protectRoute, removeAllCartItem);
router.post("/", protectRoute, addCartItem);
router.put("/:id", protectRoute, updateCartItem);
export default router;
