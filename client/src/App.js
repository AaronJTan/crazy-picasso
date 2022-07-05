import './App.css';
import GamePage from './pages/GamePage';
import HomePage from './pages/HomePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game-play" element={<GamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
