import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

// Register new user
router.post("/register", async (req: Request, res: Response) => {
  console.log("REGISTER");
  const { email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const JWT_SECRET = process.env.JWT_SECRET! as jwt.Secret;
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 3600000, // 1 hour
    });
    return res.json(user);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

export default router;
