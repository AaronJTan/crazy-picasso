// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import GamePage from "./pages/GamePage";
// import HomePage from "./pages/HomePage";
// import SignUp from "./pages/SignupPage";
// import SignIn from "./pages/SigninPage";
// import "./App.css";
// import SelectRoomPage from "./pages/SelectRoomPage";
// import React, {Component} from "react";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/select-room" element={<SelectRoomPage />} />
//         <Route path="/public" element={<GamePage />} />
//         <Route path="/private" element={<GamePage />} />
//         <Route path="/auth/signup/" element={<SignUp />} />
//         <Route path="/auth/signin/" element={<SignIn />} />
//       </Routes>
//     </Router>
import { Outlet } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />

      <Outlet />
    </div>
  );
}

export default App;
