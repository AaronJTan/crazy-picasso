import { useEffect, useState } from "react";
import PrivateLobby from "./PrivateLobby.js";
import "./SelectRoomPage.css";

const SelectRoomPage = ({user, setRoomDetails, socketRef}) => {
  const username = user;
  const [privateLobby, setPrivateLobby] = useState({inuse: false, users: [], roomCode: "", isHost: false});
  const [privateRoomCode, setPrivateRoomCode] = useState("");

  const startPrivateGame = () => {
    setRoomDetails({ ...setRoomDetails, type: "private" })
    socketRef.current.emit("start_private_game", {});
  }

  useEffect(() => {
    if (socketRef.current && privateLobby.inuse) {
      socketRef.current.on("user_joined_private_room", (users) => {
        setPrivateLobby({...privateLobby, users});
      });

      socketRef.current.on("private_game_started", () => {
        setRoomDetails({ ...setRoomDetails, type: "private" });
      });
    }
  }, [privateLobby.inuse]);
  
  const createPrivateRoom = () => {
    socketRef.current.emit("create_private_room", (response) => {
      setPrivateLobby({...privateLobby, inuse: true, users: response.users, roomCode: response.roomCode, isHost: true });
    });
  };

  const joinPrivateRoom = () => {
    socketRef.current.emit("join_private_room", { privateRoomCode }, (response) => {
      setPrivateLobby({...privateLobby, inuse: true, users: response.users, roomCode: response.roomCode });
    });
  };

  const joinPublicRoom = () => {
    setRoomDetails({...setRoomDetails, type: "public"})
  };

  if (privateLobby.inuse) {
    return (
      <PrivateLobby privateLobby={privateLobby} setRoomDetails={setRoomDetails} startPrivateGame={startPrivateGame} />
    )
  }

  return (
    <>
      <h1>Welcome {username}!</h1>
      <h1>Play with random players?</h1>
      
      <div className="room-select">        
        <button className="button animate__fadeInUp" id="join-public" onClick={joinPublicRoom}>
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
          onChange={(e) => setPrivateRoomCode(e.target.value)}
          value={privateRoomCode}
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
