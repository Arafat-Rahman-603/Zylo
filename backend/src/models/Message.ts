import mongoose, { Schema, type Document, Types } from "mongoose";

interface iMessage extends Document {
    sender: Types.ObjectId,
    content: string,
    chat: Types.ObjectId,
    createdAt: Date,
    updatedAt: Date
}

const messageSchema: Schema<iMessage> = new Schema({
    sender: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    chat: {
        type: Types.ObjectId,
        ref: "Chat",
        required: true
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

messageSchema.index({ chat: 1, createdAt: 1 });

const Message = mongoose.model<iMessage>("Message", messageSchema);

export default Message;