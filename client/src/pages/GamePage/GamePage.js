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

  console.log("about to socket useEffect");
  // process.env.REACT_APP_SERVER_URL
  const socket = io.connect("http://localhost:3000");     
  // const [socket, setSocket] = useState(null);
  const [paintData, setPaintData] = useState({ lineWidth: 5, strokeStyle: "black" });
  const [users, setUsers] = useState([]);  

  useEffect(() => {
    console.log("inside useEffect");
    if (roomCode === 'public') {
      socket.emit("join_public_room", {roomCode: roomCode, username: username});
    }
  }, []);

  // catch-all lister: any event received by the client will be printied in the console.
  socket.onAny((event, ...args) => {
    console.log("onAny");
    console.log(event, args);
  })

  socket.on("new_user_connected", (data) => {
    console.log("received message from new_user_connected");
    console.log(data);
    setUsers(data);
    console.log(users);
  })

    // socket.on("users", (users) => {
    //   users.forEach((user) => {
    //     // user.self = user.userID === socket.id;
    //     // initReactiveProperties(user);
    //     console.log(user);
    //   });
    //   // put the current user first, and then sort by username
    //   this.users = users.sort((a, b) => {
    //     if (a.self) return -1;
    //     if (b.self) return 1;
    //     if (a.username < b.username) return -1;
    //     return a.username > b.username ? 1 : 0;
    //   });
    // });

    // socket.on("user connected", (user) => {
    //   setCurrUsers([...currUsers, user.username]);
    // });

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
