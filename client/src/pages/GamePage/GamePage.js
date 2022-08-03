import "./GamePage.css";
import Chat from "../../components/Chat/Chat.jsx";
import Canvas from "../../components/Canvas/Canvas.jsx";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import PaintToolBar from "../../components/PaintToolbar/PaintToolbar";
import { useEffect, useState, useRef } from "react";
import PlayersList from "../../components/PlayersList/PlayersList";
// import RandomWords from "../../components/RandomWords/RandomWords";
// import BaseLayout from "../../layouts/BaseLayout";
// import VideoChat from "../../components/VideoChat/VideoChat";
import GameBar from "../../components/GameBar/GameBar";
import DrawingTimer from "../../components/Timer/gameTimer";
import VideoCall from "../../components/VideoChat/VideoCall";







const theme = createTheme({
  typography: {
    fontFamily: "Indie Flower",
    fontSize: 16,
  },
});

const GamePage = ({ user, roomDetails, socketRef }) => {
  const username = user;

  const [paintData, setPaintData] = useState({ lineWidth: 5, strokeStyle: "black" });
  const [users, setUsers] = useState([]);
  const [wait, setWait] = useState(true);
  const [guesses, setGuesses] = useState([]);

  useEffect(() => {
    if (roomDetails.type === "public") {
      socketRef.current.emit("join_public_game", (response) => {
        setUsers(response.users);
      });
    } else {
      socketRef.current.emit("join_private_game", (response) => {
        setUsers(response.users);
      });
    }

    socketRef.current.on("user_joined", (users) => {
      setUsers(users);
    });

    socketRef.current.on("set_wait_status", (waitStatus) => {
      setWait(waitStatus);
    });

    socketRef.current.on("receive_message", (data) => {
      setGuesses(prevGuesses =>[
        ...prevGuesses,
        { author: data.author, message: data.message },
      ]);
    });

    socketRef.current.on("user_disconnected", (users) => {
      setUsers(users);
    });
  }, []);

  if (wait) {
    return (
      <>
        Wait for users
      </>
    );
  }

  return (
    <Container maxWidth="xl">
      <GameBar 
        socketRef={socketRef} 
        isCurrentDrawer={isCurrentDrawer}
        word={word} choiceOfWords={choiceOfWords} 
        setChoiceOfWords={setChoiceOfWords} 
        round={round}
      />
      {word && <DrawingTimer expiryTimestamp={roundTime} currentDrawerUsername={currentDrawerUsername}/>};
      

      <Box sx={{ display: "flex" }}>
        <VideoCall />
        <PlayersList users={users} username={username} />
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <Canvas 
            socketRef={socketRef}
            paintData={paintData}
            currentDrawerUsername={currentDrawerUsername}
            isCurrentDrawer={isCurrentDrawer}
            word={word}
          />
          <PaintToolBar setPaintData={setPaintData} />
        </Box>
        <Chat username={username} socketRef={socketRef} guesses={guesses} setGuesses={setGuesses} />
      </Box>
    </Container>
  );
};

export default GamePage;
