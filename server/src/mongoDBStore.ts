import { connection } from "websocket";
import Room from "./models/room";
import Chat from "./models/chat";
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
        
        let roomMembers = this.rooms.get(roomId) || [];
        if (!roomMembers.includes(ws)) {
            roomMembers.push(ws)
            this.rooms.set(roomId, roomMembers);
        }
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
        let chats = await Chat.find({room: roomId}).limit(limit).skip(offset);
        return chats
    };

    async addChat(userId: string, name: string, message: string, roomId: string) {
        let chat = await Chat.create({
            userId,
            name,
            message,
            room: roomId
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
        if (!chat) return
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
        console.log("Broadcasting the messages to users", room.length)
        room.forEach((connection) => {
            console.log(connection.connected)
        })
        room.forEach((connection) => {
            if (connection.connected) {
                connection.sendUTF(JSON.stringify(outGoingPayload));
            } else {
                this.rooms.set(roomId, room.filter(x => x !== connection));
            }
        });
    };

    broadcastMulti(ws: connection, chatList: any) {
        chatList.forEach((chat: any) => {
            const outGoingPayload: OutGoingMessages = {
                type: OutgoingSupportedMessages.AddChat,
                payload: {
                    chatId: chat._id,
                    message: chat.message,
                    name: chat.name
                }
            };

            if (ws.connected) {
                ws.sendUTF(JSON.stringify(outGoingPayload));
            };
        });
    };
};