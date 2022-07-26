import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrivateLobby from "./PrivateLobby.js";
import "./SelectRoomPage.css";

const SelectRoomPage = ({user, setRoomDetails, socketRef}) => {
  const navigate = useNavigate();
  const username = user;
  const [privateLobby, setPrivateLobby] = useState({inuse: false, users: [], roomCode: ""});
  
  const createPrivateRoom = async (e) => {
    e.preventDefault();

    socketRef.current.emit("create_private_room", (response) => {
      setPrivateLobby({...privateLobby, inuse: true, users: response.users, roomCode: response.roomCode });
    });
  };

  const joinPrivateRoom = async (e) => {
    e.preventDefault();
  };

  const enterPublicRoom = (e) => {
    e.preventDefault();
    setRoomDetails({...setRoomDetails, type: "public"})
  };

  if (privateLobby.inuse) {
    return (
      <PrivateLobby privateLobby={privateLobby} />
    )
  }

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
        <button className="button animate__fadeInUp" id="create-private" onClick={createPrivateRoom}>
          Create Private
        </button>

        <h2>Or</h2>

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
