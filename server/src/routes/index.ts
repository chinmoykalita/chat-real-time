import { Router } from "express";
import User from "../models/user";
import { roomAlreadyExists, userAlreadyExists } from "../middlewares/chatMiddlewares";
import Room from "../models/room";
import { createRoomSchema, createUserBody, validateJoinRoomSchema } from "../validators/bodyValidators";

const router = Router();

router.get('/ping', (req, res) => {
    res.json("OK nice so good baby")
})
router.post('/create_user', userAlreadyExists, async (req, res) => {
    const bodyIsValid = createUserBody.safeParse(req.body);
    if (!bodyIsValid.success) {
        res.status(411).json({msg: "Input is invalid"})
    }
    const user = await User.create({name: req.body.name, password: req.body.password});

    res.status(201).send({
        'status': 'user created',
        'id': user._id,
        'name': req.body.name,
        'password': req.body.password
    });
});

router.post('/user_login', async (req, res) => {
    let { name, password } = req.body;
    const bodyIdValid = createUserBody.safeParse(req.body)
    if (!bodyIdValid.success) {
        res.status(411).json({msg: "Input is invalid"})
    }
    let user = await User.findOne({
        name,
        password
    });
    if (!user) res.json({"Status": "Creds are not valid"});

    res.json({
        'id': user?._id,
        'name': user?.name
    })

});

router.post('/create_room', roomAlreadyExists, async (req, res) => {
    let { room_name, is_private, password } = req.body;
    const isRoomValid = createRoomSchema.safeParse(req.body);
    if (!isRoomValid.success) {
        res.status(411).json({msg: "Input is not valid"})
    }

    let room = await Room.create({
        roomName: room_name,
        private: is_private,
        password: password
    });
    
    res.json({
        "Status": "Room created succesfully",
        "id": room._id,
        "room_name": room.roomName,
        "is_private": room.private,
        "password": room.password
    });
});

router.get('/get_rooms', async (req, res) => {
    let rooms = await Room.find({}, {_id: 1, roomName: 1, private: 1});
    res.json(rooms);
});

router.get('/get_one_room', async (req, res) => {
    if (!validateJoinRoomSchema.safeParse(req.body).success) {
        res.status(411).json({msg: "Input is not valid"});
    }
    console.log(JSON.stringify(validateJoinRoomSchema.safeParse(req.body)))
    let password = req.body.password;
    let room = await Room.findOne({_id: req.body.id});

    if (!room) return res.send("Invalid room id");

    if (room.private) {
        if (password !== room.password) {
            return res.send("Wrong room password");
        };
    };
    res.json({
        "room_id": room._id,
        "room_name": room.roomName,
        "is_private": room.private
    })

})

export default router