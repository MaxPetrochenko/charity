import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import dotenv from "dotenv";

dotenv.config();

export interface IUserRequest extends Request {
  user: any;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const req_ = req as IUserRequest;

  const token = req_.cookies.token; // Get token from HTTP-only cookie
  const JWT_SECRET = process.env.JWT_SECRET as jwt.Secret;
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    req_.user = await User.findById(decoded.userId).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized HEHEHEH" });
  }
};
