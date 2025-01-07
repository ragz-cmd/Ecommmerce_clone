import jwt from "jsonwebtoken";
import User from "../models/users.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken; // Ensure cookies middleware is set up
    if (!accessToken) {
      return res.status(401).json({ error: "unauthorized - no access token" });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

      // Fetch the user from the database
      const user = await User.findOne({ _id: decoded.userId }).select(
        "-password"
      );
      if (!user) {
        return res.status(401).json({ error: "unauthorized - user not found" });
      }

      req.user = user;

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "unauthorized - token expired" });
      }
      return res.status(401).json({ error: "unauthorized - invalid token" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ error: "unauthorized - admin only" });
  }
};
