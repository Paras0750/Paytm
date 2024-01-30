import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      message: "Unauthorized Request",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "");

    if (typeof decoded === "string") {
      throw new Error("Invalid JWT payload");
    }

    req.userId = decoded.userId;

    next();
  } catch (err) {
    return res.status(403).json({
      message: "Invalid Request",
    });
  }
};
