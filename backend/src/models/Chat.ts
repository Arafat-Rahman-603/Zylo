import mongoose, { Schema, Types, type Document } from "mongoose";

interface iChat extends Document {
    participants: Types.ObjectId[],
    lastMessage?: Types.ObjectId,
    lastMessageAt?: Date,
    createdAt: Date,
    updatedAt: Date
}

const chatSchema: Schema<iChat> = new Schema({
    participants: [
        {
            type: Types.ObjectId,
            ref: "User"
        }
    ],
    lastMessage: {
        type: Types.ObjectId,
        ref: "Message",
        default: null
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });


const Chat = mongoose.model<iChat>("Chat", chatSchema)

export default Chat;