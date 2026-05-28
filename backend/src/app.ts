import express from "express";
import authRouter from "./routes/authRouter.ts"
import userRouter from "./routes/userRouter.ts"
import chatRouter from "./routes/chatRouter.ts"
import messageRouter from "./routes/messageRouter.ts"

const app = express();

app.use(express.json())

app.use("/health", (req, res) => {
    res.json({
        message: "server is running",
        status: "OK",
        timestamp: new Date()
    });
})


app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/chats", chatRouter)
app.use("/api/message", messageRouter)


export default app;