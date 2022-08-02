import React from 'react';
import { useTimer } from 'react-timer-hook';

export default function DrawingTimer({ setWord, roomCode, socketRef, expiryTimestamp, currentDrawerUsername }) {
  const {
    seconds,
    minutes,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp, onExpire: () => {
    setWord("");
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
      <div style={{fontSize: '20px'}}>
        <p>{isRunning && `${currentDrawerUsername} is drawing...`}</p>
      </div>
      {/* <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      <button onClick={resume}>Resume</button> */}
      {/* <button onClick={() => {
        // Restarts to 5 minutes timer
        const time = new Date();
        time.setSeconds(time.getSeconds() + 300);
        restart(time)
      }}>Restart</button> */}
    </div>
  );
}