import React from 'react';
import { useTimer } from 'react-timer-hook';

export default function DrawingTimer({ isCurrentDrawer, roomCode, socketRef, expiryTimestamp }) {
  
  const {
    seconds,
    minutes,
  } = useTimer({ expiryTimestamp, onExpire: () => {
    if (isCurrentDrawer()) {
      socketRef.current.emit("timer_is_up", {roomCode});
    }
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