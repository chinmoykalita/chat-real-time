import { Router } from "express";
import User from "../models/user";

const userRouter = Router();

userRouter.get('/ping', (req, res) => {
    res.json("OK")
})
userRouter.get('/join_room', (req, res) => {
    User.create({
        name: "name",
        password: "awrt3qfqsfd"
    })
    .then(function(){
        res.json({"message": "User created successfully"})
    })
})

export default userRouter