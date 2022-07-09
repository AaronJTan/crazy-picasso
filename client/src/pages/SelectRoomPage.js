import { Button, Typography } from "@mui/material";
import "../css/SelectRoomPage.css";

const SelectRoomPage = () => {
  return ( 
    <><Typography variant="h2" align="center">
        Crazy Picasso
      </Typography>
    <div className="home-btn-container">
      <Button
        className="home-btn"
        id="public-btn"
        variant="contained"
        onClick={() => (window.location.href = "/public")}
      >
        Join Public
      </Button>
    </div><div className="home-btn-container">
        <Button className="home-btn" id='private-btn' variant="contained">
          Create Private
        </Button>
      </div></>
  );
}
 
export default SelectRoomPage;