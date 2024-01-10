import mongoose, { mongo } from "mongoose";
const Schema = mongoose.Schema;

const chatSchema = new Schema(
    {
        userId: String,
        name: String,
        message: String,
        room: {
            type: Schema.Types.ObjectId,
            ref: 'Room'
        },
        upvotes: {
            type: String, 
            ref: "User"
        }
    },
    { timestamps: true, collection: 'chat' },
);

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;