import "./GamePage.css";
import Chat from "../../components/Chat/Chat.jsx";
import Canvas from "../../components/Canvas/Canvas.jsx";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import PaintToolBar from "../../components/PaintToolbar/PaintToolbar";
import { useEffect, useState } from "react";
import PlayersList from "../../components/PlayersList/PlayersList";
import RandomWords from "../../components/RandomWords/RandomWords";

const GamePage = ({user, socketRef}) => {
  const username = user;

  const [paintData, setPaintData] = useState({ lineWidth: 5, strokeStyle: "black" });
  const [users, setUsers] = useState([]);
  const [wait, setWait] = useState(true);

  useEffect(() => {
    socketRef.current.emit("join_public_room", (response) => {
      if (response.users.length >= 2) {
        setWait(false);
      }

      setUsers(response.users);
    });
    
    socketRef.current.on("user_joined", (users) => {
      setWait(false);
      setUsers(users);
    });

    socketRef.current.on("user_disconnected", (users) => {
      if (users.length == 1) {
        setWait(true);
      }

      setUsers(users);
    });
  }, [])

  if (wait) {
    return (
      <>
        Wait for users
      </>
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
          <Chat username={username} socketRef={socketRef} />
        </Box>
      </Container>

      <br />
    </>
  );
};

export default GamePage;
