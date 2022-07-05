import Navbar from "../components/Navbar.js"
import "../css/GamePage.css"
import Button from '@mui/material/Button'
import BasicTextFields from "../components/BasicTextField.js"
import { Stack } from "@mui/material"
import Chat from "../components/Chat.jsx"

const GamePage = () => {
  return (
    <>
      <Navbar />
      <div className="section" id="players">
          Players Webcam
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
          <Chat />  
        </div>
      </div>
    </>
  );
}
 
export default GamePage;