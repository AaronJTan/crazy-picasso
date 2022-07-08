import "./GamePage.css"
import Chat from "../../components/Chat/Chat.jsx"
import Canvas from "../../components/Canvas/Canvas.jsx"
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

const GamePage = () => {
  return (
    <>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex'}}>
          {/* <Chat /> */}
          <Canvas/>
          <Chat />
        </Box>
      </Container>
    </>
  );
}

export default GamePage;