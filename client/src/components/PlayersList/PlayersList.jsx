import { List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import { Fragment } from "react";

const PlayersList = ({ users }) => {
  const playersList = users.map((user, index) => (
    <ListItem key={index}>
      <ListItemText primary={user} />
    </ListItem>
  ));

  return (
    <>
      <Paper elevation={10} sx={{width: "500px"}}>
        <Typography>Players List</Typography>
        <List>{playersList}</List>
      </Paper>
    </>
  );
};

export default PlayersList;
