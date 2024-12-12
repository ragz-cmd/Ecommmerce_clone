import express from "express";
import { protectRoute, adminRoute } from "../middlewares/auth.middleware.js";
import {
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  createProduct,
  toggleFeatured,
  deleteProduct,
} from "../controllers/products.controller.js";
const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", protectRoute, getFeaturedProducts);
router.get(
  "/category/:category",
  protectRoute,
  adminRoute,
  getProductsByCategory
);
router.patch("/:id", protectRoute, adminRoute, toggleFeatured);
router.post("/", protectRoute, adminRoute, createProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;
