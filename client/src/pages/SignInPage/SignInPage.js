import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleButton from "react-google-button";
import "./SignInPage.css";

const theme = createTheme();

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    console.log("handleSubmit");
    event.preventDefault();
    const player = { username, password };

    await fetch("/auth/signin/", {
      method: "POST",
      body: JSON.stringify(player),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      console.log("fetch /auth/signin/ ???");
      setUsername("");
      setPassword("");
      if (!res.ok) {
        console.log("res not okay for signin");
        navigate("/auth/signin");
      } else {
        console.log("res okay for signin");
        navigate("/select-room", { state: { username: username } });
      }
    });
  };

  return (
    <>
      <h1 className="animate__animated animate__rotateIn">Welcome Back!</h1>
      <form>
        <input
          className="animate__animated animate__lightSpeedInRight animate__delay-1s"
          type="text"
          name="username"
          onChange={e => setUsername(e.target.value)}
          placeholder="Type your username..."
          value={username}
          required
        />
        <input
          className="animate__animated animate__lightSpeedInRight animate__delay-1s"
          type="password"
          id="create-roomcode"
          name="password"
          onChange={e => setPassword(e.target.value)}
          value={password}
          placeholder="Type your password..."
          required
        />
        <div className="auth-buttons">
          <button className="button animate__animated animate__zoomIn animate__delay-2s" onClick={handleSubmit}>Sign In with Username</button>
          <button className="button animate__animated animate__zoomIn animate__delay-2s" id="google-button">Sign In with Google</button>
          <button className="button animate__animated animate__zoomIn animate__delay-2s" id="fb-button">Sign In with Facebook</button>
        </div>
      </form>
    </>
  );
}