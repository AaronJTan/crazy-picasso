import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GamePage from "./pages/GamePage";
import HomePage from "./pages/HomePage";
import SignUp from "./pages/SignupPage";
import SignIn from "./pages/SigninPage";
import "./App.css";
import SelectRoomPage from "./pages/SelectRoomPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/select-room" element={<SelectRoomPage />} />
        <Route path="/public/" element={<GamePage />} />
        <Route path="/auth/signup/" element={<SignUp />} />
        <Route path="/auth/signin/" element={<SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
