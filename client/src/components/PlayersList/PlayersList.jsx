import { List, ListItem, ListItemText, Paper, Typography } from "@mui/material";


const PlayersList = ({ users, username }) => {
  const renderPlayers = () => {
    return (
      <List>
        {
          users.map((user, index) => {
            let displayName = user.username === username ? `${username} (You)` : user.username;

            return (
              <ListItem key={index}>
                <ListItemText primary={displayName} />
              </ListItem>
            )
          })
        }
      </List>
    )
  }

  return (
    <>
      <Paper elevation={10} sx={{ width: "500px" }}>
        <Typography>Players List</Typography>
        {renderPlayers()}
      </Paper>
    </>
  );
};

export default PlayersList;
