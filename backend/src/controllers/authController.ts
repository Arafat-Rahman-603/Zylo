import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "../middlewares/auth";
import User from "../models/User";
import { clerkClient, getAuth } from "@clerk/express";

export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(400).json({ message: "User ID is missing from request" });
      return;
    }

    const user = await User.findById(userId).lean();

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function authCallback(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
      res.status(401).json({ message: "Unauthorized: Missing Clerk ID" });
      return;
    }

    let user = await User.findOne({ clerkId }).lean();

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkId);
      const email = clerkUser.emailAddresses[0]?.emailAddress;

      if (!email) {
        res.status(400).json({ message: "Email address is required but not provided by Clerk" });
        return;
      }

      const createdUser = await User.create({
        clerkId,
        name: clerkUser.firstName
          ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
          : (email.split("@")[0] || "User"),
        email,
        avatar: clerkUser.imageUrl || undefined,
      });

      user = createdUser.toObject();
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}