import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import "../css/HomePage.css";
import { Fragment } from "react";

const HomePage = () => {

  return (
    <>
      <Typography variant="h2" align="center">Crazy Picasso</Typography>
      <div className="home-btn-container">
        <Button className="home-btn" variant="contained" onClick={() => window.location.href="/signup"}>
          Sign Up
        </Button>
        <Button className="home-btn" variant="contained" onClick={() => window.location.href="/signin"}>
          Sign In
        </Button>
      </div>
      <div className="home-btn-container">
        <Button className="home-btn" id='public-btn' variant="contained" onClick={() => window.location.href="/public"}>
          Join Public
        </Button>
      </div>
      <div className="home-btn-container">
        <Button className="home-btn" id='private-btn' variant="contained">
          Create Private
        </Button>
        <Button className="home-btn" id='private-btn' variant="contained">
          Join Private
        </Button>
      </div>
    </>
  );
};

export default HomePage;
