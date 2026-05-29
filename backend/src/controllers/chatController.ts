import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middlewares/auth";
import Chat from "../models/Chat";
import { Types } from "mongoose";

export async function getChats(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(400).json({ message: "User ID is missing from request" });
      return;
    }

    const chats = (await Chat.find({ participants: userId })
      .populate("participants", "name email avatar")
      .populate("lastMessage")
      .sort({ lastMessageAt: -1 })
      .lean()) as any[];

    const formattedChats = chats.map((chat) => {
      const otherParticipant = chat.participants.find((p: any) => p._id.toString() !== userId);

      return {
        _id: chat._id,
        participant: otherParticipant ?? null,
        lastMessage: chat.lastMessage,
        lastMessageAt: chat.lastMessageAt,
        createdAt: chat.createdAt,
      };
    });

    res.json(formattedChats);
  } catch (error) {
    next(error);
  }
}

export async function getOrCreateChat(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(400).json({ message: "User ID is missing from request" });
      return;
    }

    const { participantId } = req.params;
    if (!participantId || typeof participantId !== "string" || !Types.ObjectId.isValid(participantId)) {
      res.status(400).json({ message: "Invalid or missing Participant ID" });
      return;
    }

    if (userId === participantId) {
      res.status(400).json({ message: "Cannot create chat with yourself" });
      return;
    }

    // check if chat already exists
    let chat = (await Chat.findOne({
      participants: { $all: [userId, participantId] },
    })
      .populate("participants", "name email avatar")
      .populate("lastMessage")
      .lean()) as any;

    if (!chat) {
      const newChat = new Chat({ participants: [userId, participantId] });
      await newChat.save();
      const populatedChat = await newChat.populate("participants", "name email avatar");
      chat = populatedChat.toObject();
    }

    const otherParticipant = chat.participants.find((p: any) => p._id.toString() !== userId);

    res.json({
      _id: chat._id,
      participant: otherParticipant ?? null,
      lastMessage: chat.lastMessage,
      lastMessageAt: chat.lastMessageAt,
      createdAt: chat.createdAt,
    });
  } catch (error) {
    next(error);
  }
}