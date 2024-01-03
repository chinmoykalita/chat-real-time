import { Request, Response, NextFunction } from "express";
import User from "../models/user";

async function userAlreadyExists(req:Request, res:Response, next:NextFunction) {
    let user = await User.find({name: req.body.name});
    if (user) {
        res.status(401).send({"response": "User already exists"})
    };
    next();
};

export { userAlreadyExists }