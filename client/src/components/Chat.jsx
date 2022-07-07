import {
Container,
Divider,
FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { Fragment, useEffect, useRef, useState } from "react";
import { chatMessageObj } from "../model/ChatMessageObj";
import "../css/Chat.css";
import SendIcon from "@mui/icons-material/Send";
import io from "socket.io-client";

const socket = io.connect(`http://localhost`);

export default function Chat() {
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
    <Fragment>
      <Container>
        <Paper elevation={5}>
          <Box p={3}>
            <Grid container spacing={4} alignItems="center">
              <Grid id="chat-window" xs={12} item>
                <List id="chat-window-messages">
                  {listPrevMessages}
                  <ListItem ref={scrollBottomRef}></ListItem>
                </List>
              </Grid>
              {/* Message Input */}
              <Grid xs={10} item>
                <FormControl fullWidth>
                  <TextField
                    onChange={handleMessageChange}
                    onKeyDown={handleEnterKey}
                    value={message}
                    label="Type your message..."
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
              {/* Send Message */}
              <Grid xs={1} item>
                <IconButton onClick={sendMessage} aria-label="send" color="primary">
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
