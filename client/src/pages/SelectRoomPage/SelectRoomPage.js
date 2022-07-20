import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SelectRoomPage.css";

const SelectRoomPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // navigate can send data as state
  // received from SigninPage
  const username = location.state.username;
  const [newPrivateCode, setNewPrivateCode] = useState("");
  const [existingPrivateCode, setExistingPrivateCode] = useState("");

  const createPrivateRoom = async (e) => {
    e.preventDefault();
    // setPrivateRooms([...privateRooms, newPrivateCode]);

    const data = { roomCode: newPrivateCode };

    await fetch("/private-rooms/create", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) {
        navigate("/game-play", { state: { username: username, roomCode: newPrivateCode } });
      } else {
        navigate("/select-room", { state: { username: username } });
      }
    });
  };

  const joinPrivateRoom = async (e) => {
    e.preventDefault();

    const data = { roomCode: existingPrivateCode };

    await fetch("/private-rooms/join", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) {
        navigate("/game-play", { state: { username: username, roomCode: existingPrivateCode } });
      } else {
        navigate("/select-room", { state: { username: username } });
      }
    });
  };

  const enterPublicRoom = (e) => {
    e.preventDefault();
    navigate("/game-play", { state: { username: username, roomCode: "public" } });
  };

  return (
    <>
      <h1>Welcome {username}!</h1>
      <h1>Play with random players?</h1>
      
      <div className="room-select">        
        <button className="button animate__animated animate__fadeInUp" onClick={enterPublicRoom}>
          Join Public
        </button>
      </div>
      <h1>Play with friends in private!</h1>
      <div className="room-select">
        <input
          type="text"
          id="create-roomcode"
          name="create-roomcode"
          onChange={(e) => setNewPrivateCode(e.target.value)}
          value={newPrivateCode}
          placeholder="Type your roomcode to create..."
        />
        <button className="button" onClick={createPrivateRoom}>
          Create Private
        </button>

        <input
          type="text"
          id="join-roomcode"
          name="join-roomcode"
          onChange={(e) => setExistingPrivateCode(e.target.value)}
          value={existingPrivateCode}
          placeholder="Type your roomcode to join..."
        />
        <button className="button animate__animated animate__fadeInUp" onClick={joinPrivateRoom}>
          Join Private
        </button>
      </div>
    </>
  );
};

export default SelectRoomPage;
