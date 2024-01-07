import {server as WebSocketServer, connection} from "websocket"
import { messagesHandler } from "./realTimeHandler";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { config as dotEnvConfig } from "dotenv";

import router from "./routes";

const app = express();
const port = 8080;

dotEnvConfig();

app.use(bodyParser.json())
app.use('/', router);

const MONGO_URI = process.env.MONGODB_URI || '';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB connected.")
    })

const server = app.listen(port, () => {
    console.log("Express server started on port", port)
});

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin: string) {
  return true;
};

wsServer.on('request', function(request) {
    console.log("Websocket connected");

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
                throw Error();
            }
        }
    });
});