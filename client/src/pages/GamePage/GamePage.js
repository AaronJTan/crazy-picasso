import "./GamePage.css";
import Chat from "../../components/Chat/Chat.jsx";
import Canvas from "../../components/Canvas/Canvas.jsx";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import PaintToolBar from "../../components/PaintToolbar/PaintToolbar";
import { useEffect, useState } from "react";
import PlayersList from "../../components/PlayersList/PlayersList";
import GameBar from "../../components/GameBar/GameBar";

const GamePage = ({user, roomDetails, socketRef}) => {
  const username = user;

  const [paintData, setPaintData] = useState({ lineWidth: 5, strokeStyle: "black" });
  const [users, setUsers] = useState([]);
  const [wait, setWait] = useState(true);
  const [guesses, setGuesses] = useState([]);
  const [word, setWord] = useState("");
  const [choiceOfWords, setChoiceOfWords] = useState([]);
  const [currentDrawerUsername, setCurrentDrawerUsername] = useState("");
  const [round, setRound] = useState(1);

  useEffect(() => {
    if (roomDetails.type == "public") {
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

    socketRef.current.on("select_word_to_draw", (data) => {
      setCurrentDrawerUsername(data.currentDrawerUsername);
      setChoiceOfWords(data.choiceOfWords);
    });

    socketRef.current.on("word_selected", (data) => {
      setCurrentDrawerUsername(data.currentDrawerUsername);
      setWord(data.wordToDraw);
    });

    socketRef.current.on("set_wait_status", (waitStatus) => {
      setWait(waitStatus);
    });

    socketRef.current.on("receive_guess", (data) => {
      setGuesses(prevGuesses =>[
        ...prevGuesses,
        { author: data.author, guess: data.guess },
      ]);
    });

    socketRef.current.on("round_updated", (nextRound) => {
      setRound(nextRound);
    });

    socketRef.current.on("game_ended", () => {
      alert("GAME_ENDED")
    });

    socketRef.current.on("user_disconnected", (users) => {
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
    <Container maxWidth="xl">
      <GameBar 
        socketRef={socketRef} 
        username={username} 
        currentDrawerUsername={currentDrawerUsername} 
        word={word} choiceOfWords={choiceOfWords} 
        setChoiceOfWords={setChoiceOfWords} 
        round={round}
      />

      <Box sx={{ display: "flex" }}>
        <PlayersList users={users} />
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <Canvas socketRef={socketRef} paintData={paintData} />
          <PaintToolBar setPaintData={setPaintData} />
        </Box>
        <Chat username={username} socketRef={socketRef} guesses={guesses} setGuesses={setGuesses} />
      </Box>
    </Container>
  );
};

export default GamePage;
