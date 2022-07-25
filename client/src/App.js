import { useEffect, useState } from 'react';
import './App.css';
import BaseLayout from './layouts/BaseLayout';
import HomePage from './pages/HomePage/HomePage';
import SelectRoomPage from './pages/SelectRoomPage/SelectRoomPage';
import AuthService from './services/AuthService';

function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    AuthService.getPlayer().then((response) => {
      if (response.body.username) {
        setUser(response.body.username);
      } else {
        setUser(null);
      }
    })
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
