import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import GamePage from "./pages/GamePage/GamePage";
import HomePage from "./pages/HomePage/HomePage";
import SignUp from "./pages/SignUpPage/SignUpPage";
import SignIn from "./pages/SignInPage/SignInPage";
import SelectRoomPage from "./pages/SelectRoomPage/SelectRoomPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "animate.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auth/signup/" element={<SignUp />} />
        <Route path="/auth/signin/" element={<SignIn />} />
        <Route path="/game-play" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
