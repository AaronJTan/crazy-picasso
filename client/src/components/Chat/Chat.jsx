import {
  Container,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { Fragment, useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";

export default function Chat({ username, socketRef, guesses, setGuesses }) {
  const ENTER_KEY_CODE = 13;
  const scrollBottomRef = useRef(null);
  const [guess, setGuess] = useState("");

  useEffect(() => {
    if (scrollBottomRef.current) {
      scrollBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [guesses]);

  const handleGuessChange = (event) => {
    setGuess(event.target.value);
  };

  // Allow enter key to send guess directly
  const handleEnterKey = (event) => {
    if (event.keyCode === ENTER_KEY_CODE) {
      sendGuess();
    }
  };

  const sendGuess = () => {
    if (guess) {
      // send current guess with author info using socket io
      // the guess data will be broadcasted to other players
      socketRef.current.emit("send_guess", { author: username, guess: guess });
      // update previous guess list
      setGuesses(prevGuesses => [
        ...prevGuesses,
        { author: username, guess: guess },
      ]);
      // set current guess back to empty string
      setGuess("");
    }
  };

  const listPrevGuesses = guesses.map((guessObj, index) => (
    <ListItem key={index}>
      <ListItemText primary={`${guessObj.author}: ${guessObj.guess}`} />
    </ListItem>
  ));

  return (
    <Fragment>
      <Container>
        <Paper elevation={10}>
          <Box p={3}>
              <Grid container spacing={4} alignItems="center">
                {/* Chat Window */}
                <Grid id="chat-window" xs={12} item>
                  <List id="chat-window-guesses">
                    {listPrevGuesses}
                    <ListItem ref={scrollBottomRef}></ListItem>
                  </List>
                </Grid>
                {/* Guess Input */}
                <Grid xs={10} item>
                  <FormControl fullWidth>
                    <TextField
                      onChange={handleGuessChange}
                      onKeyDown={handleEnterKey}
                      value={guess}
                      label="Type your guess..."
                      variant="outlined"
                    />
                  </FormControl>
                </Grid>
                {/* Send Guess */}
                <Grid xs={1} item>
                  <IconButton onClick={sendGuess} aria-label="send" color="primary">
                    <SendIcon />
                  </IconButton>
                </Grid>
              </Grid>
          </Box>
        </Paper>
      </Container>
    </Fragment>
  );
}
