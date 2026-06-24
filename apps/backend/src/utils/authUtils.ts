import jwt, { type JwtPayload } from "jsonwebtoken";
import { envCustom } from "./envCustom";
import type { NextFunction, Request, Response } from "express";

export function generateToken(userId: string) {
  return jwt.sign({ userId }, envCustom.secret, { expiresIn: "1h" });
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const incomingHeader = req.headers.authorization;
  if (!incomingHeader) {
    res.status(403).json({ message: "Token is missing!" });
    return;
  }
  const extractedToken = incomingHeader.split(" ")[1];
  if (extractedToken) {
    try {
      const correctToken = await jwt.verify(extractedToken, envCustom.secret);
      if (correctToken as JwtPayload) {
        req.userId = (correctToken as JwtPayload).userId;

        next();
      }
    } catch (e) {
      console.log("error in token sent");
      res.status(401).json({ message: "Invalid token!" });
    }
  }
}
