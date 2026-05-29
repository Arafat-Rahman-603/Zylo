import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middlewares/auth";
import User from "../models/User";

export async function getUsers(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(400).json({ message: "User ID is missing from request" });
      return;
    }

    const users = await User.find({ _id: { $ne: userId } })
      .select("name email avatar")
      .limit(50)
      .lean();

    res.json(users);
  } catch (error) {
    next(error);
  }
}