import React, { createContext, useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import Peer from "simple-peer";

const ContextProvider = ({ children }) => {
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState("");
  const myVideo = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        myVideo.current.srcObject = currentStream;
      })

    

  });
};
