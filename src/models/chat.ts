import mongoose, { mongo } from "mongoose";
import User from "./user";

const Schema = mongoose.Schema;

const chatSchema = new Schema(
    {
        messageBy: User,
        message: String,
        upvotes: { 
            type: mongoose.Types.ObjectId, 
            ref: "User"
        }
    },
    { timestamps: true, collection: 'chat' },
);

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;