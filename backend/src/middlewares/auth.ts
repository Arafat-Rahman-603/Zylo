import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import User from "../models/User";
import { requireAuth } from "@clerk/express";

export type AuthRequest = Request & {
  userId?: string;
};

export const protectRoute = [
  requireAuth(),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { userId: clerkId } = getAuth(req);
      if (!clerkId) {
        res.status(401).json({ message: "Unauthorized: Missing Clerk ID" });
        return;
      }

      const user = await User.findOne({ clerkId }).select("_id").lean();
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      req.userId = (user._id as any).toString();

      next();
    } catch (error) {
      next(error);
    }
  },
];