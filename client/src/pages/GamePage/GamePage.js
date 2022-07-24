import "./GamePage.css";
import Chat from "../../components/Chat/Chat.jsx";
import Canvas from "../../components/Canvas/Canvas.jsx";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import io from "socket.io-client";
import PaintToolBar from "../../components/PaintToolbar/PaintToolbar";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PlayersList from "../../components/PlayersList/PlayersList";
import RandomWords from "../../components/RandomWords/RandomWords";
import BaseLayout from "../../layouts/BaseLayout";

const GamePage = () => {
  const location = useLocation();
  const username = location.state.username;
  const roomCode = location.state.roomCode;

  const socket = io(process.env.REACT_APP_SERVER_URL);

  // const socket = io.connect(process.env.REACT_APP_SERVER_URL)

  // send username to socket to construct username list in socket server side
  socket.auth = { username };
  socket.connect();

  const [paintData, setPaintData] = useState({ lineWidth: 5, strokeStyle: "black" });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (roomCode === "public") {
      socket.emit("join_public_room", { roomCode: roomCode, username: username });
    }
  });

  socket.on("users", (data) => {
    console.log("users: ", data);
    setUsers(data);
  });

  return (
    <BaseLayout>
      {/* {paintData.strokeStyle} */}

      <h1>I'm {username}. I joined the public room!</h1>

      <Container maxWidth="xl">
        <RandomWords />
        <Box sx={{ display: "flex" }}>
          <PlayersList users={users} />
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <Canvas socket={socket} paintData={paintData} />
            <PaintToolBar setPaintData={setPaintData} />
          </Box>
          <Chat username={username} roomCode={roomCode} socket={socket} />
        </Box>
      </Container>

      <br />
    </BaseLayout>
  );
};

export default GamePage;
