import { connection } from "websocket";
import { OutGoingMessages } from "./messages/outgoingMessages";
import User from "./models/user";

interface User {
    name: string;
    _id: string;
    connection: connection;
};

interface Room {
    users: User[]
};

export class UserManager {
    private rooms: Map<string, Room>;
    constructor() {
        this.rooms = new Map<string, Room>();
    };

    addUser(name: string, userId: string, roomId:string, socket: connection) {
        if (!this.rooms.get(roomId)) {
            this.rooms.set(roomId, {
                users: []
            });
        };
        this.rooms.get(roomId)?.users.push({
            _id: userId,
            name,
            connection: socket
        });
    };

    async getUser(roomId: string, userId: string) {
        // const users = this.rooms.get(roomId)?.users;
        // console.log(users)
        // if (users) {
        //     return users.find(({_id}) => _id === userId)
        // }
        const user = await User.findOne({_id: userId});
        console.log(user)
        return user
    };

    removeUser(roomId: string, userId: string) {
        const users = this.rooms.get(roomId)?.users;
        if (users) {
            users.filter(({_id}) => _id === userId);
        }
    };

    broadcast(roomId: string, userId: string, message: OutGoingMessages) {
        const user = this.getUser(roomId, userId);
        if (!user) {
            console.error("User not found");
            return;
        };
        const room =  this.rooms.get(roomId);
        if (!room) {
            console.error("room not found");
            return;
        };
        
        room.users.forEach(({connection}) => {
            connection.sendUTF(JSON.stringify(message))
        });
    }
}