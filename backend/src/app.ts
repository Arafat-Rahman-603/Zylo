import express from "express";
import cors from "cors";
import { clerkMiddleware } from '@clerk/express';
import authRouter from "./routes/authRouter.ts";
import userRouter from "./routes/userRouter.ts";
import chatRouter from "./routes/chatRouter.ts";
import messageRouter from "./routes/messageRouter.ts";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

app.use("/health", (req, res) => {
    res.json({
        message: "server is running",
        status: "OK",
        timestamp: new Date()
    });
});


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/message", messageRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
});

// Global error handler
app.use(errorHandler);

export default app;