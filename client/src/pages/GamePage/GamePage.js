import "./GamePage.css";
import Chat from "../../components/Chat/Chat.jsx";
import Canvas from "../../components/Canvas/Canvas.jsx";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import io from "socket.io-client";
import PaintToolBar from "../../components/PaintToolbar/PaintToolbar";
import { useEffect, useRef, useState } from "react";
import PlayersList from "../../components/PlayersList/PlayersList";
import RandomWords from "../../components/RandomWords/RandomWords";
import BaseLayout from "../../layouts/BaseLayout";

const GamePage = ({user, roomDetails}) => {
  const username = user;
  const roomCode = roomDetails.roomCode;

  const socketRef = useRef(null);
  const [paintData, setPaintData] = useState({ lineWidth: 5, strokeStyle: "black" });
  const [users, setUsers] = useState([]);
  const [wait, setWait] = useState(true);

  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_SERVER_URL);
    // send username to socket to construct username list in socket server side
    socketRef.current.auth = { username };
    socketRef.current.connect();
    setWait(false);
    
    if (roomCode === "public") {
      socketRef.current.emit("join_public_room", { roomCode: roomCode }, (response) => {
        setUsers(response.users);
      });
    }
    
    socketRef.current.on("user_joined", (users) => {
      setUsers(users);
    });

    socketRef.current.on("user_disconnected", (users) => {
      setUsers(users);
    });
  }, [])

  if (wait) {
    return (
      <BaseLayout>
        Wait for users
      </BaseLayout>
    );
  }
  
  return (
    <>
      <h1>I'm {username}. I joined the public room!</h1>

      <Container maxWidth="xl">
        <RandomWords />
        <Box sx={{ display: "flex" }}>
          <PlayersList users={users} />
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <Canvas socketRef={socketRef} paintData={paintData} />
            <PaintToolBar setPaintData={setPaintData} />
          </Box>
          <Chat username={username} roomCode={roomCode} socketRef={socketRef} />
        </Box>
      </Container>

      <br />
    </>
  );
};

export default GamePage;
