import { Button } from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SelectRoomPage.css";
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

  const createPrivateRoom = async (e) => {
    e.preventDefault();
    // setPrivateRooms([...privateRooms, newPrivateCode]);

    const data = { roomCode : newPrivateCode };

    await fetch("/private-rooms/create", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      if (res.ok) {
        navigate("/game-play", { state: { username: username, roomCode: newPrivateCode } });
      } else {
        navigate("/select-room", { state: { username: username}});
      }
    })
  }

  const joinPrivateRoom = async (e) => {
    e.preventDefault();

    const data = { roomCode : existingPrivateCode};
    
    await fetch("/private-rooms/join", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      if (res.ok) {
        navigate("/game-play", { state: { username: username, roomCode: existingPrivateCode } });
      } else {
        navigate("/select-room", { state: { username: username}});
      }
    })
    
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
            variant="standard"
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
