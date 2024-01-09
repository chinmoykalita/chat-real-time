import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Room } from './types'
import axios from 'axios';

export default function Home() {

  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    axios.get('http://localhost:8080/get_rooms')
      .then((res) => {
        setRooms(res.data);
      })
      .catch((error) => {
        console.error('Error fetching rooms:', error);
      });
  }, []);

  return (
    <div>
      <h1>JOIN LIVE ROOMS</h1>
      {rooms.length && rooms.map((r) => 
        <li>r</li>
      )}

      <h3>Join room to chat</h3>
      <h3>Project is built using express mongodb next js and typescript</h3>

    </div>
  )
}
