import { Link } from "@mui/material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {

  const navigate = useNavigate();

  const handleSignin = () => {
    navigate("/auth/signin");
  };

  const handleSignup = () => {
    navigate("/auth/signup");
  };

  

  return (
    <>
      <div className="home-btn-container">
        <Button className="home-btn" variant="contained" onClick={handleSignup}>
          Sign Up
        </Button>
        <Button className="home-btn" variant="contained" onClick={handleSignin}>
          Sign In
        </Button>
        {/* using fetch gives CORS error. For now, directly provide URL for Google OAuth */}
        <Link href="http://localhost:3001/auth/google">
          <Button className="home-btn" variant="contained">
            Sign In with Google
          </Button>
        </Link>
      </div>
      
      {/* <div className="home-btn-container">
        <Button className="home-btn" id='private-btn' variant="contained">
          Create Private
        </Button>
        <Button className="home-btn" id='public-btn' variant="contained" onClick={() => navigate('/game-play')}>
          Join Public
        </Button>
      </div> */}
    </>
  );
};

export default HomePage;
