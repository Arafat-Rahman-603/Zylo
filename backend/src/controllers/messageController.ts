import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middlewares/auth";
import Message from "../models/Message";
import Chat from "../models/Chat";
import { Types } from "mongoose";

export async function getMessages(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(400).json({ message: "User ID is missing from request" });
      return;
    }

    const { chatId } = req.params;
    if (!chatId || typeof chatId !== "string" || !Types.ObjectId.isValid(chatId)) {
      res.status(400).json({ message: "Invalid or missing Chat ID" });
      return;
    }

    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
    }).select("_id").lean();

    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name email avatar")
      .sort({ createdAt: 1 }) // oldest first
      .lean();

    res.json(messages);
  } catch (error) {
    next(error);
  }
}