import Navbar from "../components/Navbar.jsx";
import "../css/GamePage.css";
import Chat from "../components/Chat.jsx";
import { useLocation } from "react-router-dom";

const GamePage = () => {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <div className="section" id="players">
        <div id="video-grid"></div>
      </div>
      <div className="container">
        <div className="section" id="drawing">
          <div className="section" id="canvas">
            canvas drawing
          </div>
          <div className="section" id="palette">
            palette
          </div>
        </div>

        <div className="section" id="chatting">
          <Chat username={location.state.username}/>
        </div>
      </div>
    </>
  );
};

export default GamePage;
