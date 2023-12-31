import { OutGoingMessages, SupportedMessage as OutgoingSupportedMessages } from "./messages/outgoingMessages";
import {server as WebSocketServer, connection} from "websocket"
import http from 'http';
import { UserManager } from "./UserManager";
import { IncommingMessage, SupportedMessage } from "./messages/IncomingMessages";

import { InMemoryStore } from "./InMemoryStore";

const server = http.createServer(function(request: any, response: any) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server

const userManager = new UserManager();
const store = new InMemoryStore();

server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

 const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true
});

function originIsAllowed(origin: string) {
  return true;
}

wsServer.on('request', function(request) {
    console.log("inside connect");

    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {

        // Todo add rate limitting logic here 
        if (message.type === 'utf8') {
            try {
                messagesHandler(connection, JSON.parse(message.utf8Data));
            } catch(e) {

            }
        }
    });
});


function messagesHandler(ws: connection, message: IncommingMessage) {
    if (message.type == SupportedMessage.JoinRoom) {
        const payload = message.payload;
        userManager.addUser(payload.name, payload.userId, payload.roomId, ws)
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
                roomId: payload.roomId,
                message: payload.message,
                name: user.name,
                upvotes: 0,
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
                roomId: payload.roomId,
                chatId: payload.chatId,
                upvotes: chat.upvotes.length
            }
        };
        userManager.broadcast(payload.roomId, payload.userId, outGoingPayload)
    }
}
