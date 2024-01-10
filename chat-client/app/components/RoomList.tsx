"use client"

import React from 'react'
import { RoomType } from '../types'
import axios from 'axios';
import { SetStateAction, Dispatch } from 'react';

interface Props {
    connectedRoom: string | null;
    setConnectedRoom: Dispatch<SetStateAction<RoomType | null>>;
}

const RoomList = React.memo(({connectedRoom, setConnectedRoom}: Props) => {
    const [rooms, setRooms] = React.useState<RoomType[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    const fetchRooms = async () => {
        let rooms = await axios.get('http://localhost:8080/get_rooms');
        setRooms(rooms.data);
        setIsLoading(false);
    };

    React.useEffect(() => {
        fetchRooms();
    }, []);

    const connectToRoom = async (room: RoomType) => {
        if (connectedRoom !== null) {
            console.log("Room of id", room._id, "already connected")
        };
        if (room.private) {
            let pass = prompt("Please enter the code to join");
            if (!pass) {
                return;
            }
            try {
                await axios.post("http://localhost:8080/get_one_room/", {"id": room._id, "password": pass});
                console.log("Joining the room");
                setConnectedRoom(room);
            } catch {
                alert("Incorrect room password");
            }

        } else {
            try {
                await axios.post("http://localhost:8080/get_one_room/", {"id": room._id });
                setConnectedRoom(room)
            } catch {
                alert("Invalid room id")
            }
        };
        return;
    };

    return (
        <div>
            {!isLoading && <h3>Active Rooms</h3> }
            {isLoading ? "Loading rooms..."
                :rooms.length === 0 && <div>No active rooms at the moment, please check after sometimes </div>
            }
            {rooms.length > 0 && rooms.map((r, i) => 
                <div key={i} onClick={()=> connectToRoom(r)} className='p-4 w-[85vw] md:w-[50vw] bg-slate-300 my-4 rounded hover:bg-slate-400 cursor-pointer'>
                    <div className='text-xl'>{r.roomName}</div>
                    <div className='text-sm italic'>{r.private ? "Private": "Public"}</div>
                </div>
            )}
        </div>
  )
})

export default RoomList