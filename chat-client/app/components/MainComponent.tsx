"use client"

import React, { useEffect, useState } from 'react'
import { RoomType } from '../types';
import axios from 'axios';
import RoomList from './RoomList';
import ChatBox from './ChatBox/ChatBox';

export default React.memo(function MainComponent() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectedRoom, setConnectedRoom] = useState<RoomType | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080", ['echo-protocol']);
    socket.addEventListener('open', (event) => {
      console.log('WebSocket connection opened:', event);
      setSocket(socket);
    });

    return () => {
      if (socket) {
        socket.close()
      }
    };
  }, []);

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
      <h2 className='text-3xl p-6 mb-10'>SpaceCord</h2>
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
