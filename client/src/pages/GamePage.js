import * as React from "react";
import Navbar from "../components/Navbar.jsx";
import "../css/GamePage.css";
import Chat from "../components/Chat.jsx";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import io from "socket.io-client"

const socket = io.connect(process.env.REACT_APP_SERVER_URL);
// const socket = io.connect("http://localhost:3001");

const GamePage = () => {
  const location = useLocation();
  const username = location.state.username;
  const roomCode = location.state.roomCode;

  useEffect(() => {
    socket.emit("join_room", roomCode);
  })

  return (
    <>
      <Navbar />
      <h1>{username} {roomCode}</h1>
      <div className="section" id="players">
        <div id="video-grid"></div>
      </div>
      <div className="container">
        <div className="section" id="drawing">
          <div className="section" id="canvas">
            canvas drawing
          </div>
          <div className="section" id="palette">
            palette
          </div>
        </div>

        <div className="section" id="chatting">
          <Chat
            username={username}
            roomCode={roomCode}
            socket={socket}
          />
        </div>
      </div>
    </>
  );
};

export default GamePage;
