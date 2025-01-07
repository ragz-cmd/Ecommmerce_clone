import User from "../models/users.model.js";
import jwt from "jsonwebtoken";
import redis from "../lib/redis.js";
import dotenv from "dotenv";
dotenv.config();
const generateTokens = async (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};
const redisRefresh = async (refreshToken, userId) => {
  await redis.set(
    `refreshToken:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};
const setCookie = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password });
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "invalid credentials" });
    } else if (!(await user.comparePassword(password))) {
      return res.status(400).json({ error: "invalid credentials" });
    }
    const { accessToken, refreshToken } = await generateTokens(user._id);
    setCookie(res, accessToken, refreshToken);
    redisRefresh(refreshToken, user._id);
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "user logged in successfully",
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "internal server error", error: error.message });
  }
};
export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  console.log({ name, email, password });
  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" }); // Use `message`
    }
    const user = await User.create({ name, email, password });
    const { accessToken, refreshToken } = await generateTokens(user._id);
    setCookie(res, accessToken, refreshToken);
    redisRefresh(refreshToken, user._id);
    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    return res
      .status(500) // Use 500 for internal server errors
      .json({ message: "Internal server error", error: error.message }); // Consistent `message` key
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.decode(refreshToken, process.env.JWT_SECRET);
      await redis.del(`refreshToken:${decoded.userId}`);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(201).json({ message: "user logged out successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

export const refresh = async (req, res) => {
  const clientRefreshToken = req.cookies.refreshToken;
  if (!clientRefreshToken) {
    return res.status(401).json({ error: "refresh token not found" });
  }
  try {
    const decoded = jwt.decode(clientRefreshToken, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const redisRefreshToken = await redis.get(`refreshToken:${userId}`);
    if (clientRefreshToken !== redisRefreshToken) {
      return res.status(401).json({ error: "invalid refresh token" });
    }
    const { accessToken, refreshToken } = await generateTokens(userId);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    res.status(201).json({
      message: "access token refreshed successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};
export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
