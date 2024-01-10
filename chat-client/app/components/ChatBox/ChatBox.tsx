import React from 'react'
import { RoomType } from '../../types';
import './style.css';

type Room = {
   room: RoomType | null,
   socket: WebSocket | null
};

const ChatBox = ({ room, socket }: Room) => {
   const messagesRef = React.useRef<HTMLDivElement>(null);
   const [messages, setMessages] = React.useState<Array<string>>([]);
   const [newMessage, setNewMessage] = React.useState<string>('');


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
      if (messagesRef && messagesRef.current) {
         messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
      setMessages(["hey", "how are you", "are you fine"])
   }, []);

   const ChatItem = (message: string, index: number) => {
      return (
            <div key={index} className="mb-2 p-2 'bg-gray-300 border-solid border-2 border-black">
               {message}
            </div>
      )
   }


   return (
      <>
         <div>{room?.roomName}</div>

         <div className="flex flex-col h-96 bg-gray-200 p-4">
            <div className="flex-1 overflow-y-auto">
               {messages.map((message, index) => 
                  ChatItem(message, index)
               )}
            </div>
            <div className="flex items-center mt-4">
               <input
                  type="text"
                  className="flex-1 p-2 border rounded"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
               />
               <button
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                  // onClick={handleSendMessage}
               >
                  Send
               </button>
            </div>
         </div>
      </>

   )
}

export default ChatBox