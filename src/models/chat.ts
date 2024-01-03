import mongoose, { mongo } from "mongoose";
import User from "./user";
import Room from "./room";

const Schema = mongoose.Schema;

const chatSchema = new Schema(
    {
        userId: String,
        name: String,
        message: String,
        room: Room,
        upvotes: {
            type: String, 
            ref: "User"
        }
    },
    { timestamps: true, collection: 'chat' },
);

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;