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

import "./SignUpPage.css";

const theme = createTheme();

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const player = { firstName, lastName, username, email, password };

    console.log("hit handleSubmit signup");
    await fetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify(player),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      if (!res.ok) {
        console.log("signup not okay");
        navigate("/auth/signup");
      } else {
        console.log("signup okay");
        navigate("/select-room", { state: { username: username } });
      }
    });
  };

  return (
    <>
      <h1 className="animate__animated animate__rotateIn">Sign Up</h1>
      <form className="sign-up-form">
        <label className="animate__animated animate__lightSpeedInLeft animate__delay-1s" for="first-name">First Name</label>
        <input className="animate__animated animate__lightSpeedInRight animate__delay-1s" type="text" id="first-name" />

        <label className="animate__animated animate__lightSpeedInLeft animate__delay-1s" for="last-name">Last Name</label>
        <input className="animate__animated animate__lightSpeedInRight animate__delay-1s" type="text" id="last-name" />

        <label className="animate__animated animate__lightSpeedInLeft animate__delay-1s" for="username">Username</label>
        <input className="animate__animated animate__lightSpeedInRight animate__delay-1s" type="text" id="username" />

        <label className="animate__animated animate__lightSpeedInLeft animate__delay-1s" for="email">Email</label>
        <input className="animate__animated animate__lightSpeedInRight animate__delay-1s" type="text" id="email" />

        <label className="animate__animated animate__lightSpeedInLeft animate__delay-1s" for="password">Password</label>
        <input className="animate__animated animate__lightSpeedInRight animate__delay-1s" type="password" id="password" />

        <button className="button animate__animated animate__zoomIn animate__delay-2s">Sign Up with Username</button>
      </form>
    </>
  );
}
