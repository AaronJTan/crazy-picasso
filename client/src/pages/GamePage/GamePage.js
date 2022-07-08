import Navbar from "../../components/Navbar/Navbar.js"
import "./GamePage.css"
import Chat from "../../components/Chat/Chat.jsx"
import Canvas from "../../components/Canvas/Canvas.jsx"

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
            <Canvas />
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