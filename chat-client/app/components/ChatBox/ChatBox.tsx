import React from 'react'
import { RoomType } from '../../types';
import './style.css';

type Room = {
   room: RoomType,
   socket: WebSocket,
   leaveRoom: () => void;
};

const ChatBox = ({ room, socket, leaveRoom }: Room) => {
   const messagesRef = React.useRef<HTMLDivElement>(null);
   const inputBoxRef = React.useRef<HTMLInputElement>(null);

   const joinRoom = (room_id: string) => {
      if (socket) {
         socket.send(JSON.stringify({
            "type": "JOIN_ROOM",
            "payload": {
               "name": localStorage.getItem("name"),
               "userId": localStorage.getItem("loggedUser"),
               "roomId": room_id,
            }
         }));
      };
   };

   React.useEffect(() => {
      joinRoom(room._id)
   }, []);

   socket?.addEventListener('message', (event) => {
      let message = JSON.parse(event.data).payload?.message;
      console.log("Message recieved", message);
      const messageElem = document.createElement("div");
      messageElem.className = "mb-2 p-2 bg-gray-300 border-solid border-2 border-black"
      messageElem.innerText = message;
      messagesRef.current?.appendChild(messageElem);
      if (messagesRef.current) {
         messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
   });


   const sendMessage = () => {
      if (!inputBoxRef.current?.value) {
         return
      };
      let message = inputBoxRef.current.value;
      socket.send(JSON.stringify({
         "type": "SEND_MESSAGE",
         "payload": {
            userId: localStorage.getItem("loggedUser"),
            roomId: room._id,
            message: message
         }
      }));
      inputBoxRef.current.value = ''
   };

   return (
      <>
         <div className=' text-2xl'>{room?.roomName}</div>
         <div className=' text-blue-600 underline mb-2 cursor-pointer' onClick={leaveRoom}>exit room</div>

         <div className="flex flex-col h-96 bg-gray-200 p-4">
            <div ref={messagesRef} className="flex-1 overflow-y-auto">
            </div>
            <div className="flex items-center mt-4">
               <input
                  type="text"
                  className="flex-1 p-2 border rounded"
                  placeholder="Type your message..."
                  ref={inputBoxRef}
               />
               <button
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={sendMessage}
               >
                  Send
               </button>
            </div>
         </div>
      </>

   )
}
export default ChatBox