import React from 'react';
import { useTimer } from 'react-timer-hook';

export default function DrawingTimer({ setWord, roomCode, socketRef, expiryTimestamp, currentDrawerUsername }) {
  const {
    seconds,
    minutes,
    isRunning,
  } = useTimer({ expiryTimestamp, onExpire: () => {
    setWord("");
    console.log("onExpire");

    socketRef.current.emit("timer_is_up", {roomCode}, () => {
      console.log(roomCode);
      console.log("timer_is_up emitted");
    });
    
  }});

  const twoDigitFormat = (time) => {
    return String(time).padStart(2, '0');
  }

  return (
    <div style={{textAlign: 'center'}}>
      <div style={{fontSize: '50px'}}>
        <span>{twoDigitFormat(minutes)}</span>:<span>{twoDigitFormat(seconds)}</span>
      </div>
    </div>
  );
}