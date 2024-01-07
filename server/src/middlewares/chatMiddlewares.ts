import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import Room from "../models/room";

async function userAlreadyExists(req:Request, res:Response, next:NextFunction) {
    let user = await User.findOne({name: req.body.name});
    if (user) {
        res.json({"response": "User already exists"})
        return
    };
    next();
};

async function roomAlreadyExists(req: Request, res: Response, next: NextFunction) {
    let room = await Room.findOne({roomName: req.body.room_name});
    if (room){
        res.json({"response": "Room already exists"});
        return
    };
    next();
}

export { userAlreadyExists, roomAlreadyExists }