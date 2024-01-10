"use client"

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { RoomType } from './types'
import axios from 'axios';
import RoomList from './components/RoomList';
import ChatBox from './components/ChatBox/ChatBox';

export default function Home() {
  const [socket, setSocket] = useState<WebSocket|null>(null);
  const [connectedRoom, setConnectedRoom] = useState<RoomType|null>(null);

  useEffect(() => {
    let user = localStorage.getItem("loggedUser");
    if (!user) {
      let name = prompt("Please enter your name!");
      let pass = prompt("Please enter the password!");

      if (name && pass) {
        axios.post('http://localhost:8080/create_user', {"name": name, "password": pass})
          .then((res) => {
            if (res.status === 201) {
              console.log("user created succesfully of id", res.data.id)
              localStorage.setItem("loggedUser", res.data.id);
              localStorage.setItem("name", res.data.name)
            }
          });
      };
    };
  }, []);



  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080", ['echo-protocol']);
    socket.addEventListener('open', (event) => {
      console.log('WebSocket connection opened:', event);
      setSocket(socket);
    });
  }, []);

  

  // const sendMessage = () => {
  //   if (socket) {
  //     socket.send(JSON.stringify({
  //         "type": "SEND_MESSAGE",
  //         "payload": {
  //             userId: localStorage.getItem("loggedUser"),
  //             roomId: connectedRoom,
  //             message: currentMessage
  //         }
  //     }));
  //   };
  // };

  socket?.addEventListener('message', (event) => {
      console.log("Message recieved");
      let message = JSON.parse(event.data).payload?.message;
      console.log(message);
  });

  return (
    <div className='flex items-center justify-center flex-col'>
      <h2 className='text-3xl p-6 mb-10'>SpaceCord</h2>
      {!connectedRoom &&
        <RoomList
          connectedRoom={connectedRoom}
          setConnectedRoom={setConnectedRoom} 
        />
      }
      {connectedRoom && <ChatBox room={connectedRoom} socket={socket} />}

    </div>
  )
}
