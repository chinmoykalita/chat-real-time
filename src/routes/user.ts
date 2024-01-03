import { Router } from "express";
import User from "../models/user";
import { userAlreadyExists } from "../middlewares/authMiddlewares";

const userRouter = Router();

userRouter.get('/ping', (req, res) => {
    res.json("OK")
})
userRouter.get('/create_user', userAlreadyExists, async (req, res) => {
    let name = req.body.username;
    let password = req.body.password;
    const user = await User.create({name: name, password: password});

    res.status(201).send({
        'status': 'user created',
        'id': user._id,
        'name': name,
        'password': password
    });
})

export default userRouter