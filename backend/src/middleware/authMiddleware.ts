import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export interface IUserRequest extends Request {
  user: any;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;
  const req_ = req as IUserRequest;
  if (req_.headers.authorization && req_.headers.authorization.startsWith('Bearer')) {
    token = req_.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
    req_.user = await User.findById(decoded.userId).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
};
