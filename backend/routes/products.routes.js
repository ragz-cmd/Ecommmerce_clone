import express from "express";
import { protectRoute, adminRoute } from "../middlewares/auth.middleware.js";
import {
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  createProduct,
  toggleFeatured,
  deleteProduct,
  getRecommendedProducts,
} from "../controllers/products.controller.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.patch("/:id", protectRoute, adminRoute, toggleFeatured);
router.post("/", protectRoute, adminRoute, createProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);
router.get("/recommendations", protectRoute, getRecommendedProducts);

export default router;
