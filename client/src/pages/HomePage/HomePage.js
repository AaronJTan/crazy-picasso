import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "./HomePage.css";

const HomePage = () => {

  let navigate = useNavigate();

  return (
    <>
      {/* <Typography variant="h2" align="center">Crazy Picasso</Typography> */}
      <div className="home-btn-container">
        <Button className="home-btn" variant="contained">
          Sign Up
        </Button>
        <Button className="home-btn" variant="contained">
          Sign In
        </Button>
      </div>
      <div className="home-btn-container">
        <Button className="home-btn" id='private-btn' variant="contained">
          Create Private
        </Button>
        <Button className="home-btn" id='public-btn' variant="contained" onClick={() => navigate('/game-play')}>
          Join Public
        </Button>
      </div>
    </>
  );
};

export default HomePage;
