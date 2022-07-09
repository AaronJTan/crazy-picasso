import "./GamePage.css"
import Chat from "../../components/Chat/Chat.jsx"
import Canvas from "../../components/Canvas/Canvas.jsx"
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import io from "socket.io-client";
import PaintToolBar from "../../components/PaintToolbar/PaintToolbar";

const GamePage = () => {
  const socket = io.connect(process.env.REACT_APP_SERVER_URL);

  return (
    <>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex' }}>

          <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: "space-between" }}>
            <Canvas socket={socket} />
            <PaintToolBar />
          </Box>


          <Chat socket={socket} />
        </Box>
      </Container>

      <br />
    </>
  );
}

export default GamePage;