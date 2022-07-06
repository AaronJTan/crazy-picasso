import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GamePage from './pages/GamePage';
import HomePage from './pages/HomePage';
import SignUp from './pages/SignupPage';
import SignIn from './pages/SigninPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/public/" element={<GamePage />} />
        <Route path="/signup/" element={<SignUp />} />
        <Route path="/signin/" element={<SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
