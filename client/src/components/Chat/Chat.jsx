import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { useEffect, useRef, useState } from "react";
import { chatMessageObj } from "../../model/ChatMessageObj";
import "./Chat.css";
import SendIcon from "@mui/icons-material/Send";

export default function Chat({socket}) {
  const ENTER_KEY_CODE = 13;

  const scrollBottomRef = useRef(null);
  // const webSocket = useRef(null);
  const [prevMessages, setPrevMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setPrevMessages([...prevMessages, { message: data.message }]);
    });
    if (scrollBottomRef.current) {
      scrollBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [prevMessages]);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleEnterKey = (event) => {
    if (event.keyCode === ENTER_KEY_CODE) {
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (message) {
      console.log("Send!");
      socket.emit("send_message", { message: message });
      setPrevMessages([...prevMessages, new chatMessageObj(message)]);
      setMessage("");
    }
  };

  const listPrevMessages = prevMessages.map((chatMessageObj, index) => (
    <ListItem key={index}>
      <ListItemText primary={`${chatMessageObj.user}: ${chatMessageObj.message}`} />
    </ListItem>
  ));

  return (
    <Container disableGutters>
      <Paper elevation={5}>
        <Box p={3}>
          <Grid container alignItems="center">
            <Grid id="chat-window" xs={12} item>
              <List id="chat-window-messages">
                {listPrevMessages}
                <ListItem ref={scrollBottomRef}></ListItem>
              </List>
            </Grid>

            {/* Message Input */}
            <Grid xs={12} item sx={{ display: 'flex' }}>
              <FormControl fullWidth>
                <TextField
                  onChange={handleMessageChange}
                  onKeyDown={handleEnterKey}
                  value={message}
                  label="Type your guess here..."
                  variant="outlined"
                />
              </FormControl>

              {/* <IconButton onClick={sendMessage} aria-label="send" color="primary" sx={{ ml: 1, p: 2 }}>
                <SendIcon />
              </IconButton> */}
            </Grid>
          </Grid>

        </Box>
      </Paper>
    </Container>
  );
}
