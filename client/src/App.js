import { useEffect, useState } from 'react';
import './App.css';
import BaseLayout from './layouts/BaseLayout';
import GamePage from './pages/GamePage/GamePage';
import HomePage from './pages/HomePage/HomePage';
import SelectRoomPage from './pages/SelectRoomPage/SelectRoomPage';
import AuthService from './services/AuthService';

function App() {
  const [user, setUser] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);

  useEffect(() => {
    AuthService.getPlayer().then((response) => {
      if (response.body.username) {
        setUser(response.body.username);
      } else {
        setUser(null);
      }
    })
  }, [])

  const renderComponent = () => {
    if (!user) {
      return <HomePage />;
    }

    if (!roomDetails) {
      return <SelectRoomPage setRoomDetails={setRoomDetails} user={user} />;
    }

    return <GamePage roomDetails={roomDetails} />;
  }

  return (
    <BaseLayout>
      {renderComponent()}
    </BaseLayout>
  )
}

export default App;
