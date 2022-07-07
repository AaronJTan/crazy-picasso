import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import "../css/HomePage.css";
import { Fragment } from "react";

const HomePage = () => {
  const handleGoogleSignin = async () => {
    await fetch("/auth/google", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }).then((res) => {
      console.log(res);
    });
  };

  const handleSignin = () => {
    window.location.href = "/auth/signin";
  };

  const handleSignup = () => {
    window.location.href = "/auth/signup";
  };

  return (
    <>
      <Typography variant="h2" align="center">
        Crazy Picasso
      </Typography>
      <div className="home-btn-container">
        <Button className="home-btn" variant="contained" onClick={handleSignup}>
          Sign Up
        </Button>
        <Button className="home-btn" variant="contained" onClick={handleSignin}>
          Sign In
        </Button>
        <Button className="home-btn" variant="contained" onClick={handleGoogleSignin}>
          Sign In with Google
        </Button>
      </div>
      <div className="home-btn-container">
        <Button
          className="home-btn"
          id="public-btn"
          variant="contained"
          onClick={() => (window.location.href = "/public")}
        >
          Join Public
        </Button>
      </div>
      <div className="home-btn-container">
        <Button className="home-btn" id="private-btn" variant="contained">
          Create Private
        </Button>
        <Button className="home-btn" id="private-btn" variant="contained">
          Join Private
        </Button>
      </div>
    </>
  );
};

export default HomePage;
