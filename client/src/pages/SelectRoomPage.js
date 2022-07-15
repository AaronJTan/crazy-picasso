import { Button, Typography } from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/SelectRoomPage.css";
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

const SelectRoomPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // navigate can send data as state
  // received from SigninPage
  const username = location.state.username;
  const [newPrivateCode, setNewPrivateCode] = useState("");
  const [existingPrivateCode, setExistingPrivateCode] = useState("");
  const [privateRooms, setPrivateRooms] = useState([]);

  const createPrivateRoom = (e) => {
    e.preventDefault();
    setPrivateRooms([...privateRooms, newPrivateCode]);
    navigate("/game-play", { state: { username: username, roomCode: newPrivateCode } });
  };

  const joinPrivateRoom = (e) => {
    e.preventDefault();
    console.log(privateRooms);
    if (privateRooms.includes(existingPrivateCode)) {
      navigate("/game-play", { state: { username: username, roomCode: existingPrivateCode} });
    } else {
      setExistingPrivateCode("");
      navigate("/select-room", { state: { username: username}});
    }
    
  };

  const enterPublicRoom = (e) => {
    e.preventDefault();
    navigate("/game-play", { state: { username: username, roomCode: "public" } });
  };

  return (
    <>
      <h1>Welcome {username}! Select the room you want to join!</h1>
      <div className="home-btn-container">
        <Button className="home-btn" id="public-btn" variant="contained" onClick={enterPublicRoom}>
          Join Public
        </Button>
      </div>
      <div className="home-btn-container">
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="outlined-basic"
            label="Room Code"
            variant="outlined"
            onChange={(e) => setNewPrivateCode(e.target.value)}
            value={newPrivateCode}
          />
          <Button
            type="submit"
            className="home-btn"
            id="private-btn"
            variant="contained"
            onClick={createPrivateRoom}
          >
            Create Private
          </Button>
        </Box>
      </div>
      <div className="home-btn-container">
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="outlined-basic"
            label="Room Code"
            variant="outlined"
            onChange={(e) => setExistingPrivateCode(e.target.value)}
            value={existingPrivateCode}
          />
        </Box>
        <Button
          type="submit"
          className="home-btn"
          id="private-btn"
          variant="contained"
          onClick={joinPrivateRoom}
        >
          Join Private
        </Button>
      </div>
    </>
  );
};

export default SelectRoomPage;
