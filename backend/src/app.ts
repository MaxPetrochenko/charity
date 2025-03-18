import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import fundraisingRoutes from "./routes/fundraisingRoutes";
import { protect } from "./middleware/authMiddleware";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

dotenv.config({ path: ".env" });
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // Allow frontend origin
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies/auth headers
  })
);
app.options("*", cors());

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log("Origin:", req.headers.origin);
  next();
});

mongoose
  //.connect(process.env.MONGO_URI!)
  .connect('mongodb://127.0.0.1:27017')
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/fundraising", protect, fundraisingRoutes);

app.get("/api/protected", (req, res) => {
  const token = req.cookies.token; // Get token from HTTP-only cookie
  const JWT_SECRET = 'myrandomjwtsecret';
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ message: "You accessed a protected route!", user: decoded });
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
});
app.post("/logout", (req, res) => {
  console.log("CAME TO LOGOUT");
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production", // Use HTTPS in production
  });
  res.json({ message: "Logged out successfully" });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
