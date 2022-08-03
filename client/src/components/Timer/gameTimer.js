import React from 'react';
import { useTimer } from 'react-timer-hook';

export default function DrawingTimer({ expiryTimestamp, currentDrawerUsername }) {
  const {
    seconds,
    minutes,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });

  const twoDigitFormat = (time) => {
    return String(time).padStart(2, '0');
  }


  return (
    <div style={{textAlign: 'center'}}>
      <div style={{fontSize: '50px'}}>
        <span>{twoDigitFormat(minutes)}</span>:<span>{twoDigitFormat(seconds)}</span>
      </div>
      <div style={{fontSize: '20px'}}>
        <p>{isRunning ? `${currentDrawerUsername} is drawing...` : `${currentDrawerUsername} is choosing a word...`}</p>
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