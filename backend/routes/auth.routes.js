import express from "express";
import {
  login,
  signup,
  logout,
  refresh,
} from "../controllers/auth.controllers.js";
const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.post("/refresh", refresh);

export default router;
