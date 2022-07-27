import { useEffect, useState } from "react";
import "./App.css";
import BaseLayout from "./layouts/BaseLayout";
import HomePage from "./pages/HomePage/HomePage";
import SelectRoomPage from "./pages/SelectRoomPage/SelectRoomPage";
import AuthService from "./services/AuthService";
import { UserProvider, useUpdateUsername } from "./components/Context/UserContext";
import { AppBar, Typography } from "@mui/material";

function App() {

  const [user, setUser] = useState(null);
  const updateUsername = useUpdateUsername();

  useEffect(() => {
    AuthService.getPlayer().then((response) => {
      if (response.body.username) {
        // updateUsername(response.body.username);
        setUser(response.body.username);
      } else {
        // updateUsername(null);
        setUser(null);
      }
    });
  }, []);

  return (
    <>
      {/* <UserProvider value=""> */}
      <BaseLayout>{user ? <SelectRoomPage usernameP={user} /> : <HomePage />}</BaseLayout>
      {/* </UserProvider> */}
    </>
  );
}

export default App;
