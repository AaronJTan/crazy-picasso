import React, { useState, useContext, createContext } from "react";

const UsernameContext = createContext();
const UpdateUsernameContext = createContext();

/*
Custom Hook to globalize username variable throughout the app

  Access to the username variable
  const username = userUsername(); // username has the global value stored in username variable

  Change the value of username variable
  const updateUsername = useUpdateUsername();  // define updateUsername globally
  updateUsername(newUsername);

  For more explanation, watch https://www.youtube.com/watch?v=hUhWtYXgg0I&list=PLg5g_z-gxDmtg3BsvjMKsGfluWPmEK2vr
*/

export const useUsername = () => {
  return useContext(UsernameContext);
};

export const useUpdateUsername = () => {
  return useContext(UpdateUsernameContext);
};

export const UserProvider = ({ value, children }) => {
  const [username, setUsername] = useState(value);
  return (
    <UsernameContext.Provider value={username}>
      <UpdateUsernameContext.Provider value={setUsername}>
        {children}
      </UpdateUsernameContext.Provider>
    </UsernameContext.Provider>
  );
};
