import { Button, Typography } from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/SelectRoomPage.css";


const SelectRoomPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state.username;

  return (
    <>
      <Typography variant="h2" align="center">
        Crazy Picasso
      </Typography>
      <div className="home-btn-container">
        <Button
          className="home-btn"
          id="public-btn"
          variant="contained"
          onClick={() => navigate("/public", {state: {username: username}})}
        >
          Join Public
        </Button>
      </div>
      <div className="home-btn-container">
        <Button className="home-btn" id="private-btn" variant="contained">
          Create Private
        </Button>
      </div>
    </>
  );
};

export default SelectRoomPage;
