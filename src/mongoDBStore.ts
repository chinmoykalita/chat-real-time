import Chat from "./models/chat";
import { Store } from "./store/Store";

export class MongoDBStore extends Store {

    async getChats(roomId: string, limit: number, offset: number) {
        let chats = await Chat.find({room: roomId}).sort({createdAt: -1}).limit(limit).skip(offset);
        return chats
    };

    async addChat(userId: string, name: string, message: string, roomId: string) {
        let chat = await Chat.create({
            userId,
            name,
            message,
            room: roomId,
            upvotes: []
        });
        return chat
    };
    
    async upVote(userId: string, roomId: string, chatId: string) {
        let updatedChat = await Chat.updateOne(
            {_id: chatId},
            { $addToSet: { upvotes: userId } },
            { new: true }
        );
        return updatedChat;
    }
}