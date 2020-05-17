import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { Button } from '@material-ui/core';
import Announcement from './Announcement.jsx';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';

function App() {
  var lwmAudio = useRef();
  var stream = useRef();
  const [vol, setVol] = useState(50);
  const [canPlay, setCanPlay] = useState(false);
  const [plause, setPlause] = useState("Play");
  const [streamDetails, setStreamDetails] = useState({});
  const [streamIp, setStreamIp] = useState("");
  const [streamPort, setStreamPort] = useState("");
  const [userClickedPause, setUserClickedPause] = useState(false);
  const volInterval = 10;
  const randomCacheNo = Math.floor(Math.random() * 1001);

  useEffect(() => {
    setStreamIp(streamDetails.ipAddress);
    setStreamPort(streamDetails.port);
  }, [streamDetails]);

  useEffect(() => {
    let mounted = true;
    axios({
      method: 'get',
      url: `ipPort.json`,
    })
      .then(function (response) {
        if (mounted) {
          setStreamDetails(response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    return () => {
      mounted = false;
    };
  }, [])

  const increaseVolFn = () => {
    if (vol < 100) {
      let sum = vol + volInterval;
      if (sum <= 100) {
        setVol(sum)
      } else {
        setVol(100)
      }
    }
  }

  const decreaseVolFn = () => {
    let diff = vol - volInterval;
    if (vol > 0) {
      if (diff >= 0) {
        setVol(diff)
      } else {
        setVol(0)
      }
    }
  }

  useEffect(
    () => {
      lwmAudio.current.addEventListener('play', () => {
        setPlause(<CircularProgress color="secondary" size={25} />);
      });
      lwmAudio.current.addEventListener("playing", () => {
        setPlause("Stop");
      });
      lwmAudio.current.addEventListener("pause", () => {
        if (!userClickedPause) {
          lwmAudio.current.load();
          lwmAudio.current.play();
        } else {
          setPlause("Play");
        }
      });
      lwmAudio.current.addEventListener('canplay', () => {
        setCanPlay(true)
      });
      stream.current.addEventListener('error', () => {
        setPlause("Play");
        setCanPlay(false);
      });
    }, []
  );

  useEffect(() => {
    lwmAudio.current.volume = vol / 100;
  }, [vol])

  const playPause = () => {
    if (plause === "Play") {
      lwmAudio.current.load();
      lwmAudio.current.play();
    }
    if (plause === "Stop") {
      setUserClickedPause(true);
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
          <source ref={stream} src={`${streamIp}:${streamPort}/stream?type=.mp3&nocache=${randomCacheNo}`} type="audio/mpeg" />
        </audio>
        <Announcement />

      </div>
    </div>
  );
}

export default App;
