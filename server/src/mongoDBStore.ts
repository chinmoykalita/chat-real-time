import { connection } from "websocket";
import Chat from "./models/chat";
import Room from "./models/room";
import { Store } from "./store/Store";
import { OutGoingMessages, SupportedMessage as OutgoingSupportedMessages } from "./messages/outgoingMessages";


export class MongoDBStore {
    private rooms: Map<string, connection[]>

    constructor() {
        this.rooms = new Map<string, connection[]>();
    };

    async joinRoom(roomId: string, ws: connection) {
        let room = await Room.find({_id: roomId});
        if (!room) {
            return "Room not found"
        };
        this.rooms.set(roomId, [ws]);
    };

    async leaveRoom(roomId: string, ws: connection) {
        let room = this.rooms.get(roomId);
        if (!room) {
            return "Room not found"
        };
        let users = room.filter(x => x !== ws);
        this.rooms.set(roomId, users)
    };

    async getUsers(roomId: string) {
        let room = await Room.find({_id: roomId});
        if (!room) {
            return "Room not found"
        };
        let room_members = this.rooms.get(roomId) || [];
        return room_members;
    };

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
    };

    broadcastChat(roomId: string, chat: any) {
        const room =  this.rooms.get(roomId);
        if (!room) {
            console.error("room not found");
            return;
        };
        const outGoingPayload: OutGoingMessages = {
            type: OutgoingSupportedMessages.AddChat,
            payload: {
                chatId: chat._id,
                message: chat.message,
                name: chat.name
            }
        };
        
        room.forEach((connection) => {
            connection.sendUTF(JSON.stringify(outGoingPayload))
        });
    }
}