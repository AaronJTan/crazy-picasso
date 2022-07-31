import "./GamePage.css";
import Chat from "../../components/Chat/Chat.jsx";
import Canvas from "../../components/Canvas/Canvas.jsx";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import PaintToolBar from "../../components/PaintToolbar/PaintToolbar";
import { useEffect, useState } from "react";
import PlayersList from "../../components/PlayersList/PlayersList";
import RandomWords from "../../components/RandomWords/RandomWords";
import BaseLayout from "../../layouts/BaseLayout";
import VideoChat from "../../components/VideoChat/VideoChat";

// const VideoContainer = styled.div`
//   padding: 20px;
//   display: flex;
//   width: 90%;
//   margin: auto;
//   flex-wrap: wrap;
// `;

// const StyledVideo = styled.video`
//   height: 300px;
//   width: 300px;
//   object-fit: cover;
// `;

// const VideoPlayer = (props) => {
//   const ref = useRef();

//   useEffect(() => {
//     props.peer.on("stream", (stream) => {
//       ref.current.srcObject = stream;
//     });
//   }, []);

//   return <StyledVideo playsInline autoPlay ref={ref} />;
// };

// const videoConstraints = {
//   height: window.innerHeight / 2,
//   width: window.innerWidth / 2,
// };

const GamePage = ({user, roomDetails, socketRef}) => {
  const username = user;

  const [paintData, setPaintData] = useState({ lineWidth: 5, strokeStyle: "black" });
  const [users, setUsers] = useState([]);
  const [wait, setWait] = useState(true);
  const [guesses, setGuesses] = useState([]);

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
          <VideoChat roomCode={roomCode} socket={socket} username={username}/>
          
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <Canvas socketRef={socketRef} paintData={paintData} />
            <PaintToolBar setPaintData={setPaintData} />
          </Box>
          <Chat username={username} socketRef={socketRef} guesses={guesses} setGuesses={setGuesses} />
        </Box>
      </Container>

      <br />
    </>
  );
};

export default GamePage;
