import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { Button } from '@material-ui/core';
import Announcement from './Announcement.jsx';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';

function App() {
  var lwmAudio = useRef();
  var stream = useRef();
  const [vol, setVol] = useState(1);
  const [canPlay, setCanPlay] = useState(false);
  const [plause, setPlause] = useState("Play");
  let volInterval = 0.1;

  const increaseVolFn = () => {
    if (vol < 1) {
      let sum = vol + volInterval;
      let roundedSum = Math.round(sum * 10) / 10;
      if (roundedSum <= 1) {
        setVol(roundedSum)
      } else {
        setVol(1)
      }
    }
    if (vol === 1) {
      setVol(1);
    }
  }

  const decreaseVolFn = () => {
    let diff = vol - volInterval;
    let roundedDiff = Math.round(diff * 10) / 10;
    if (vol > 0) {
      if (roundedDiff >= 0) {
        setVol(roundedDiff)
      } else {
        setVol(0)
      }
    }
  }

  useEffect(
    () => {
      lwmAudio.current.addEventListener("playing", () => {
        setPlause("Stop");
      });
      lwmAudio.current.addEventListener("pause", () => {
        setPlause("Play");
      });
      lwmAudio.current.addEventListener('canplay', () => {
        setCanPlay(true)
      });
      stream.current.addEventListener('error', () => {
        setCanPlay(false)
      });
      lwmAudio.current.volume = vol;
    }
  );

  const playPause = () => {
    if (plause === "Play") {
      lwmAudio.current.load();
      lwmAudio.current.play();
    }
    if (plause === "Stop") {
      lwmAudio.current.pause();
    }
  }

  return (
    <div id="audio-container">
      <div id="audio-wrapper">
        <img src="/lwm.jpg" style={{ borderRadius: "15px" }} width="100%" height="250px" alt="player" />
        {
          !canPlay ?
            <div style={{
              width: "100%", backgroundColor: "red", color: "white", padding: "10px",
              borderRadius: "8px",
              margin: "10px 0"
            }}>
              "Stream currently unavailable. Please try again later"
            </div>
            : null
        }
        <div style={{
          display: "flex",
          flexBasis: "100%",
          alignItems: "center"
        }}>
          <Button variant="outlined" color="primary" onClick={playPause} value={plause}>
            {plause}
          </Button>
          <div style={{
            flexGrow: 1
          }}></div>
          <div style={{
            textAlign: "center"
          }}>
            <div>Volume</div>
            <div style={{
              display: "flex"
            }}>
              <Button variant="contained" color="primary" onClick={decreaseVolFn}>
                <RemoveIcon />
              </Button>
              <div style={{
                width: "30px"
              }}>
                {vol}
              </div>
              <Button variant="contained" color="primary" onClick={increaseVolFn}>
                <AddIcon />
              </Button>
            </div>
          </div>
        </div>
        <audio preload="metadata" ref={lwmAudio} style={{ width: "100%", height: "100%" }}>
          {/* <source ref={stream} src="http://178.32.107.151:2331/;stream/1" type="audio/mpeg" /> */}
          <source ref={stream} src="http://http://78.129.229.122:14076/;stream/1" type="audio/mpeg" />

        </audio>
        <Announcement />
      </div>
    </div>
  );
}

export default App;
