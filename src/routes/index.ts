import { Router } from "express";
import User from "../models/user";
import { roomAlreadyExists, userAlreadyExists } from "../middlewares/chatMiddlewares";
import Room from "../models/room";

const router = Router();

router.get('/ping', (req, res) => {
    res.json("OK nice so good baby")
})
router.post('/create_user', userAlreadyExists, async (req, res) => {
    let name = req.body.name;
    let password = req.body.password;
    const user = await User.create({name: name, password: password});

    res.status(201).send({
        'status': 'user created',
        'id': user._id,
        'name': name,
        'password': password
    });
});

router.post('/user_login', async (req, res) => {
    let { name, password } = req.body;

    if (!name) res.json({"Error": "Name field is missinng"});
    if (!password) res.json({"Error": "Password field is missinng"});

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