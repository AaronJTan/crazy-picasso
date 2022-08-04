import Peer from "peerjs";
import { useRef } from "react";
import { useEffect, useState } from "react";

const VideoCall = () => {
  const [peerID, setpeerID] = useState("");
  const anotherVideoRef = useRef(null);
  const myVideoRef = useRef();
  const myPeer = useRef();

  useEffect(() => {
    console.log("useEffect fired");
    const peer = new Peer();

    peer.on("open", function (id) {
      console.log("My peer ID is: ", id);
    });

    peer.on("call", (call) => {
      let getUserMedia =
        navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      getUserMedia(
        { video: true, audio: true },
        function (stream) {
          myVideoRef.current.srcObject = stream;
          myVideoRef.current.play();
          // send myMediaStream to the caller
          call.answer(stream);
          call.on("stream", (remoteStream) => {
            anotherVideoRef.current.srcObject = remoteStream;
            anotherVideoRef.current.play();
          });
        },
        function (err) {
          console.log("Failed to get local stream", err);
        }
      );
    });
    myPeer.current = peer;
  }, []);

  const call = (anotherPeerId) => {
    let getUserMedia =
      navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    getUserMedia(
      { video: true, audio: true },
      function (stream) {
        myVideoRef.current.srcObject = stream;
        myVideoRef.current.play();
        let call = myPeer.current.call(anotherPeerId, stream);
        call.on("stream", function (remoteStream) {
          anotherVideoRef.current.srcObject = remoteStream;
          anotherVideoRef.current.play();
        });
      },
      function (err) {
        console.log("Failed to get local stream", err);
      }
    );
  };

  return (
    <>
      <div>
        <video ref={myVideoRef} />
      </div>

      <div>
        <video ref={anotherVideoRef} />
      </div>
    </>
  );
};

export default VideoCall;
