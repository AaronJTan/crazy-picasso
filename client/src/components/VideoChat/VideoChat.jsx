import styled from "styled-components";
import Peer from "simple-peer";
import { useEffect, useRef, useState } from "react";
import { Button, Typography } from "@mui/material";

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

const turnOffVideo = () => {};

const VideoChat = ({ socketRef, useranme, users }) => {
  const [peers, setPeers] = useState([]);
  const userVideo = useRef();
  const peersRef = useRef([]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(
      (stream) => {
        userVideo.current.srcObject = stream;
      }
    );
  }, []);

  useEffect(() => {
    console.log("peersRef: ", peersRef);
    console.log("peers: ", peers);
    const peersTemp = []
    users.forEach((user) => {
      console.log(user);
      console.log(socketRef.current.id);
      // A new user creates a peer connection with each of the existing users in the room
      // by sending its user and stream
      // createPeer requires existing users' user, new user's ID and new user's stream
      if (user.socketId !== socketRef.current.id) {
        console.log("creating a peer from new user just joined");
        const peer = createPeer(user.socketId, socketRef.current.id, userVideo.current.srcObject);
        // managing two arrays
        // peersRef and peers
        // peers array is used for rendering streams purposes
        peersRef.current.push({
          peerID: user.socketId,
          peer,
        });
        peersTemp.push(peer);
      }
    });
    setPeers(peersTemp);

    // for existing users, they also need to get notified when new user joins
    socketRef.current.on("user_joined_video", (data) => {
      // data.signal: stream of new user
      // data.callerID: socketID of new user just joined
      // stream: stream of existing users
      const peer = addPeer(data.signal, data.newUserID, userVideo.current.srcObject);
      peersRef.current.push({
        peerID: data.newUserID,
        peer,
      });
      // adding the new peer obj at the end of peers array
      // peers.current.push(peer);
      setPeers((peers) => [...peers, peer]);
    });

    socketRef.current.on("receiving_returned_signal", (data) => {
      const item = peersRef.current.find((p) => p.peerID === data.id);
      item.peer.signal(data.signal);
    });
  }, [users]);

  function createPeer(existingUserID, newUserID, newUserStream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      newUserStream,
    });

    peer.on("signal", (signal) => {
      // existingUserID: socketID of existing users
      // newUserID: socketID of new user
      // signal: stream of new user
      socketRef.current.emit("send_video_signal", { existingUserID, newUserID, signal });
    });

    return peer;
  }

  function addPeer(newUserSignal, newUserID, stream) {
    // adds a new peer to their existing peers
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      // newUserID: socketID of new user
      // signal: ?
      socketRef.current.emit("return_video_signal", { signal, newUserID });
    });
    // an existing user is accepting the incoming signal
    peer.signal(newUserSignal);

    return peer;
  }

  return (
    <>
      <VideoContainer>
        <StyledVideo muted ref={userVideo} autoPlay playsInline />
        {peers.map((peer, index) => (
          <Video key={index} peer={peer} />
        ))}
      </VideoContainer>
      <Button onClick={turnOffVideo}>No Video</Button>
    </>
  );
};

export default VideoChat;
