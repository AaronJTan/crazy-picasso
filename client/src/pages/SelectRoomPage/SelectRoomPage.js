import { useNavigate } from "react-router-dom";
import "./SelectRoomPage.css";

const SelectRoomPage = ({user, setRoomDetails}) => {
  const navigate = useNavigate();
  const username = user;
  
  const createPrivateRoom = async (e) => {
    e.preventDefault();
  };

  const joinPrivateRoom = async (e) => {
    e.preventDefault();
  };

  const enterPublicRoom = (e) => {
    e.preventDefault();
    setRoomDetails(true)
  };

  return (
    <>
      <h1>Welcome {username}!</h1>
      <h1>Play with random players?</h1>
      
      <div className="room-select">        
        <button className="button animate__fadeInUp" id="join-public" onClick={enterPublicRoom}>
          Join Public
        </button>
      </div>
      <h1>Play with friends in private!</h1>
      <div className="room-select">
        <input
          type="text"
          id="create-roomcode"
          name="create-roomcode"
          placeholder="Type your roomcode to create..."
        />
        <button className="button animate__fadeInUp" id="create-private" onClick={createPrivateRoom}>
          Create Private
        </button>

        <input
          type="text"
          id="join-roomcode"
          name="join-roomcode"
          placeholder="Type your roomcode to join..."
        />
        <button className="button animate__fadeInUp" id="join-private" onClick={joinPrivateRoom}>
          Join Private
        </button>
      </div>
    </>
  );
};

export default SelectRoomPage;
