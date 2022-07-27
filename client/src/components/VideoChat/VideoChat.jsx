import styled from "styled-components";
import { Peer } from "peerjs";
import { useEffect, useRef, useState } from "react";
import { Typography } from "@mui/material";

const VideoContainer = styled.div`
  padding: 20px;
  display: flex;
  width: 50%;
  margin: auto;
  flex-wrap: wrap;
  flex-direction: column;
`;

const StyledVideo = styled.video`
  height: 150px;
  width: 150px;
  object-fit: cover;
`;

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <StyledVideo playsInline autoPlay ref={ref} />;
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

const VideoChat = ({ roomCode, socket, username }) => {
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomID = roomCode;

  useEffect(() => {
    // ask permission for video and audio access
    navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then((stream) => {
      userVideo.current.srcObject = stream;
      socketRef.current.on("all users", (users) => {
        const peers = [];
        users.forEach((userID) => {
          // A new user creates a peer connection with each of the existing users in the room
          // by sending its userID and stream
          // createPeer requires existing users' userID, new user's ID and new user's stream
          const peer = createPeer(userID, socketRef.current.id, stream);
          // managing two arrays
          // peersRef and peers
          // peers array is used for rendering streams purposes
          peersRef.current.push({
            peerID: userID,
            peer,
          });
          peers.push(peer);
        });
        setPeers(peers);
      });
      // for existing users, they also need to get notified when new user joins
      socket.on("user joined", (payload) => {
        // payload.callerID: who's calling us

        const peer = addPeer(payload.signal, payload.callerID, stream);
        peersRef.current.push({
          peerID: payload.callerID,
          peer,
        });

        setPeers((users) => [...users, peer]);
      });

      socket.on("receiving returned signal", (payload) => {
        const item = peersRef.current.find((p) => p.peerID === payload.id);
        item.peer.signal(payload.signal);
      });
    });
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", { userToSignal, callerID, signal });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });
    // an existing user is accepting the incoming signal
    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <VideoContainer>
      <StyledVideo muted ref={userVideo} autoPlay playsInline />
      {peers.map((peer, index) => {
        return <Video key={index} peer={peer} />;
      })}
      <Typography>{username}</Typography>
    </VideoContainer>
  );
};

export default VideoChat;
