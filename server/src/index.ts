import {server as WebSocketServer, connection} from "websocket"
import { messagesHandler } from "./realTimeHandler";
import express, { NextFunction, Response, Request } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { config as dotEnvConfig } from "dotenv";

import router from "./routes";
import { messagesHandler2 } from "./realTimeHandler2";

const app = express();
const port = 8080;

dotEnvConfig();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, PATCH, OPTIONS");
    next();
});
app.use(bodyParser.json())
app.use('/', router);


const MONGO_URI = process.env.MONGODB_URI || '';

console.log("connecting to the mongo db")
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
                // messagesHandler(connection, JSON.parse(message.utf8Data));
                messagesHandler2(connection, JSON.parse(message.utf8Data));
            } catch(e) {
                throw Error();
            }
        }
    });
});