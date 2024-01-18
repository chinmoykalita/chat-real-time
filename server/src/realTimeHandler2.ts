import { connection } from "websocket";
import { IncommingMessage, SupportedMessage } from "./messages/IncomingMessages";
import { OutGoingMessages, SupportedMessage as OutgoingSupportedMessages } from "./messages/outgoingMessages";
import { UserManager } from "./UserManager";
import { InMemoryStore as Store } from "./InMemoryStore";
import { MongoDBStore } from "./mongoDBStore";

const userManager = new UserManager();
// const store = new Store();
const store = new MongoDBStore();

export async function messagesHandler2(ws: connection, message: IncommingMessage) {
    if (message.type == SupportedMessage.JoinRoom) {
        const payload = message.payload;
        store.joinRoom(payload.roomId, ws);
        let chats = await store.getChats(payload.roomId, 40, 0);
        console.log(chats);
        store.broadcastMulti(ws, chats);
        // store.broadcast(payload.roomId, `${payload.name} joined`);
    };
    if (message.type == SupportedMessage.SendMessage) {
        const payload = message.payload;
        const user = await userManager.getUser(payload.roomId, payload.userId)
        if(!user) {
            console.error("User not found in the room");
            return;
        };

        let chat = await store.addChat(payload.userId, user.name || "", payload.message, payload.roomId);
        if (!chat) {
            return
        };

        store.broadcastChat(payload.roomId, chat)
    };
    if (message.type === SupportedMessage.LeaveRoom) {
        const payload = message.payload;
        store.leaveRoom(payload.roomId, ws)
        console.log(connection, "left room");
    }
    // if (message.type == SupportedMessage.UpvoteMessage) {
    //     const payload = message.payload;
    //     const chat = store.upVote(payload.userId, payload.roomId, payload.chatId);
    //     if (!chat) {
    //         return
    //     }
    //     const outGoingPayload: OutGoingMessages = {
    //         type: OutgoingSupportedMessages.UpdateChat,
    //         payload: {
    //             roomId: payload.roomId,
    //             chatId: payload.chatId,
    //             upvotes: chat.upvotes.length
    //         }
    //     };
    //     userManager.broadcast(payload.roomId, payload.userId, outGoingPayload)
    // }
};

