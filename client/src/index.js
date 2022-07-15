import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import GamePage from "./pages/GamePage/GamePage";
import HomePage from "./pages/HomePage/HomePage";
import SignUp from "./pages/SignupPage";
import SignIn from "./pages/SigninPage";
import SelectRoomPage from "./pages/SelectRoomPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="/game-play" element={<GamePage />} />
          <Route path="/auth/signup/" element={<SignUp />} />
          <Route path="/auth/signin/" element={<SignIn />} />
          <Route path="/select-room" element={<SelectRoomPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
