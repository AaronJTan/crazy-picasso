import "./GamePage.css";
import Chat from "../../components/Chat/Chat.jsx";
import Canvas from "../../components/Canvas/Canvas.jsx";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import io from "socket.io-client";
import PaintToolBar from "../../components/PaintToolbar/PaintToolbar";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Typography } from "@mui/material";

const GamePage = () => {
  
  const location = useLocation();
  const username = location.state.username;
  const roomCode = location.state.roomCode;

  const socket = io.connect(process.env.REACT_APP_SERVER_URL);     
  const [paintData, setPaintData] = useState({ lineWidth: 5, strokeStyle: "black" });
  const [users, setUsers] = useState(['abc']);  

  useEffect(() => {
    console.log("inside useEffect");
    if (roomCode === 'public') {
      socket.emit("join_public_room", {roomCode: roomCode, username: username});
    }
  });

  return (
    <>
      {paintData.strokeStyle}
      <h1>
        My username is {username}. I join the room code: {roomCode}
      </h1>
      <Container maxWidth="xl">
        <Box sx={{ display: "flex" }}>
          <Typography>{users}</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <Canvas socket={socket} paintData={paintData} />
            <PaintToolBar setPaintData={setPaintData} />
          </Box>

          <Chat username={username} roomCode={roomCode} socket={socket} />
        </Box>
      </Container>

      <br />
    </>
  );
};

export default GamePage;
