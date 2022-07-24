import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import BaseLayout from './layouts/BaseLayout';
import HomePage from './pages/HomePage/HomePage';
import SelectRoomPage from './pages/SelectRoomPage/SelectRoomPage';
import AuthService from './services/AuthService';

function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    AuthService.getPlayer().then((response) => {
      setUser(response.body.username);
    })
      .catch((response) => {
        setUser(null);
      });
  }, [])

  return (
    <BaseLayout>
      {
        user ? <SelectRoomPage usernameP={user} /> : <HomePage />
      }
    </BaseLayout>
  );
}

export default App;
