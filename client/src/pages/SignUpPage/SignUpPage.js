import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseLayout from "../../layouts/BaseLayout";

import "./SignUpPage.css";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !username || !email || !password) {
      alert("Missing Inputs");
      return;
    }

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
        navigate("/signup");
      } else {
        console.log("signup okay");
        navigate("/", { state: { username: username } });
      }
    });
  };

  return (
    <BaseLayout>
      {/* animations disabled by removing animate__animated from className */}
      <h1 className="animate__rotateIn">Sign up to become crazy picasso!</h1>
      <form className="sign-up-form">
        <input
          className="animate__lightSpeedInRight animate__delay-1s"
          type="text"
          id="first-name"
          onChange={(e) => setFirstName(e.target.value)}
          value={firstName}
          placeholder="What's your first name...?"
          required
        />
        <input
          className="animate__lightSpeedInRight animate__delay-1s"
          type="text"
          id="last-name"
          onChange={(e) => setLastName(e.target.value)}
          value={lastName}
          placeholder="What's your last name...?"
          required
        />
        <input
          className="animate__lightSpeedInRight animate__delay-1s"
          type="text"
          id="username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          placeholder="Create your username..."
          required
        />
        <input
          className="animate__lightSpeedInRight animate__delay-1s"
          type="text"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Type your email..."
          required
        />
        <input
          className="animate__lightSpeedInRight animate__delay-1s"
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Type your password..."
          required
        />
        <div className="auth-buttons">
          <button
            className="button animate__zoomIn animate__delay-2s"
            onClick={handleSubmit}
          >
            Sign Up with Username
          </button>
        </div>
      </form>
    </BaseLayout>
  );
}
