import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import type { SafeUser, OfficerRole } from "../models/User.js";

export interface AuthJwtPayload {
  userId: string;
  email: string;
  role: OfficerRole;
  badgeId: string;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthJwtPayload;
}

export function generateToken(user: { id?: string; _id?: any; email: string; role: OfficerRole; badgeId: string; name: string }): string {
  const userId = user.id || (user._id ? user._id.toString() : "");
  const payload: AuthJwtPayload = {
    userId,
    email: user.email,
    role: user.role,
    badgeId: user.badgeId,
    name: user.name,
  };

  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthJwtPayload | null {
  try {
    return jwt.verify(token, ENV.JWT_SECRET) as AuthJwtPayload;
  } catch {
    return null;
  }
}

export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      error: "Authentication required",
      message: "Please provide a valid Bearer token in the Authorization header.",
    });
    return;
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    res.status(401).json({
      error: "Invalid or expired token",
      message: "Session expired or authentication signature invalid.",
    });
    return;
  }

  req.user = decoded;
  next();
}

export function requireRole(allowedRoles: OfficerRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: "Forbidden",
        message: `Role '${req.user.role}' is not authorized for this emergency action. Required: ${allowedRoles.join(", ")}`,
      });
      return;
    }

    next();
  };
}
