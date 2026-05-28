import mongoose, { Schema, type Document} from "mongoose";

interface iUser extends Document {
    clerkId: string,
    name: string,
    email: string,
    avatar?: string,
    createdAt: Date,
    updatedAt: Date
}

const userSchema: Schema<iUser> = new Schema({
    clerkId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email'
        ],
        trim: true
    },
    avatar: {
        type: String,
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


const User = mongoose.model<iUser>('User', userSchema)