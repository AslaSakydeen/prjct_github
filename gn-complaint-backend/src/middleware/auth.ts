import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const auth = (
  req: any,
  res: Response,
  next: NextFunction
) => {

  try {

    // Get token from frontend
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "No token",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as any;

    // Save user data
    req.user = decoded;

    next();

  } catch (error) {

    res.status(401).json({
      message: "Invalid token",
    });
  }
};

export default auth;