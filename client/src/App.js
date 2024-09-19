import logo from "./logo.svg";
import "./App.css";
import { io } from "socket.io-client";
import { useEffect, useMemo, useState } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketId, setSocketId] = useState("");
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState();

  const socket = useMemo(() => io("http://localhost:9000"), []);

  // handle personal message
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  // handle group message
  const handleRoomName = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoom(roomName);
    setRoomName("");
  }

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
      console.log(socket.id);
      setSocketId(socket.id);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <h4>{socketId}</h4>

        {/* Room name */}
        <form onSubmit={handleRoomName}>
        <input
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          type="text"
          placeholder="Room name"
        />
        <button type="submit">Join</button>
      </form>

      {/* personal message */}
      <form onSubmit={handleSubmit}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Message"
        />
        <input
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          type="text"
          placeholder="Person Id"
        />
        <button type="submit">Send</button>
      </form>

      {messages.map((i, idx) => (
        <div key={idx}>
          <ul>
            <li>
              <b>{i}</b>
            </li>
          </ul>
        </div>
      ))}
    </>
  );
}

export default App;
