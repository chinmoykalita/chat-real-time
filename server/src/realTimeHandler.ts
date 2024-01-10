import { connection } from "websocket";
import { IncommingMessage, SupportedMessage } from "./messages/IncomingMessages";
import { OutGoingMessages, SupportedMessage as OutgoingSupportedMessages } from "./messages/outgoingMessages";
import { UserManager } from "./UserManager";
import { InMemoryStore as Store } from "./InMemoryStore";

const userManager = new UserManager();
const store = new Store();

export function messagesHandler(ws: connection, message: IncommingMessage) {
    if (message.type == SupportedMessage.JoinRoom) {
        const payload = message.payload;
        userManager.addUser(payload.name, payload.userId, payload.roomId, ws);
    };
    if (message.type == SupportedMessage.SendMessage) {
        const payload = message.payload;
        const user = userManager.getUser(payload.roomId, payload.userId)
        if(!user) {
            console.error("User not found in the room");
            return;
        }
        let chat = store.addChat(payload.userId, user.name, payload.message, payload.roomId);
        if (!chat) {
            return
        }
        const outGoingPayload: OutGoingMessages = {
            type: OutgoingSupportedMessages.AddChat,
            payload: {
                chatId: chat.id,
                // roomId: payload.roomId,
                message: payload.message,
                name: user.name,
                // upvotes: 0,
            }
        };
        userManager.broadcast(payload.roomId, payload.userId, outGoingPayload)
    };
    if (message.type == SupportedMessage.UpvoteMessage) {
        const payload = message.payload;
        const chat = store.upVote(payload.userId, payload.roomId, payload.chatId);
        if (!chat) {
            return
        }
        const outGoingPayload: OutGoingMessages = {
            type: OutgoingSupportedMessages.UpdateChat,
            payload: {
                // roomId: payload.roomId,
                chatId: payload.chatId,
                // upvotes: chat.upvotes.length
            }
        };
        userManager.broadcast(payload.roomId, payload.userId, outGoingPayload)
    }
};

