"use client"

import React, { useEffect, useState } from 'react'
import { RoomType } from '../types';
import axios from 'axios';
import RoomList from './RoomList';
import ChatBox from './ChatBox/ChatBox';
import { useSocket } from '../hooks/hooks';

export default React.memo(function MainComponent() {
  const [connectedRoom, setConnectedRoom] = useState<RoomType | null>(null);
  
  const socket = useSocket("ws://localhost:8080");

  const leaveRoom = () => {
    if (connectedRoom) {
      if (socket) {
        socket.send(JSON.stringify({
          "type": "LEAVE_ROOM",
          "payload": {
            "userId": localStorage.getItem("loggedUser"),
            "roomId": connectedRoom._id
          }
        }));
      };
      setConnectedRoom(null);
    }
  };

  return (
    <div className='flex items-center justify-center flex-col'>
      <h2 className='text-3xl p-6'>SpaceCord</h2>
      {!connectedRoom &&
        <RoomList
          connectedRoom={connectedRoom}
          setConnectedRoom={setConnectedRoom}
        />
      }
      {(connectedRoom && socket) && <ChatBox room={connectedRoom} socket={socket} leaveRoom={leaveRoom} />}

    </div>
  )
})
