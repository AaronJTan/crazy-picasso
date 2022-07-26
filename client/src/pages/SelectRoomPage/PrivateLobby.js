import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

const PrivateLobby = ({ privateLobby }) => {
    return (
        <Container>
            <h1>PRIVATE ROOM</h1>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ flex: 1 }}>
                    <h2>PRIVATE LOBBY</h2>
                </Box>

                <Box sx={{ flex: 1, height: "100px" }}>
                    <h2>Players</h2>

                    {
                        privateLobby.users.map((user, index) => {
                            return <h3>{user.username}</h3>;
                        })
                    }
                </Box>
            </Box>

            <Box sx={{ mt: 20 }}>
                <h2>Invite your Friends!</h2>
                <h3 style={{ backgroundColor: "white" }}>{process.env.REACT_APP_CLIENT_URL}/?{privateLobby.roomCode}</h3>
            </Box>
        </Container>
    )
}

export default PrivateLobby;