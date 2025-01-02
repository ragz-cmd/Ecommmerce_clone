import express from "express";
import {
  login,
  signup,
  logout,
  refresh,
  getProfile,
} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/profile", protectRoute, getProfile);

export default router;
