import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { Button, TextField } from '@material-ui/core';
import Announcement from './Announcement.jsx';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import CircularProgress from '@material-ui/core/CircularProgress';
const firebase = window.firebase;
const FirechatUI = window.FirechatUI;
const Firechat = window.Firechat;


function App() {
  var lwmAudio = useRef();
  var stream = useRef();
  const [vol, setVol] = useState(50);
  const [canPlay, setCanPlay] = useState(false);
  const [plause, setPlause] = useState("Play");
  const [displayName, setDisplayName] = useState("Guest");
  const [roomName, setRoomName] = useState("Prayer Requests");
  const volInterval = 10;
  const randomCacheNo = Math.floor(Math.random() * 1001);

  useEffect(() => {
    var config = {
      apiKey: "AIzaSyD0Y5TflsYjOn8AlFM56Wf0C6nDvBso8m0",
      authDomain: "living-waters-radio.firebaseapp.com",
      databaseURL: "https://living-waters-radio.firebaseio.com",
      projectId: "living-waters-radio",
      storageBucket: "living-waters-radio.appspot.com",
      messagingSenderId: "867795591270",
      appId: "1:867795591270:web:db471d1b905b28baac8da7",
      measurementId: "G-XR9PVMTG8L"
    };
    if (!firebase.apps.length) {
      try {
        firebase.initializeApp(config);
      } catch (err) {
        console.error("Firebase initialization error raised", err.stack)
      }
    }
    //firebase.analytics();
    const firebaseRef = firebase.database().ref("lwm-chat");
    const chat = new FirechatUI(firebaseRef, document.getElementById("firechat-wrapper"));
    firebase.auth().signInAnonymously().catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });

    firebase.auth().onAuthStateChanged(function (anonUser) {
      if (anonUser) {
        // User is signed in.
        console.log("yeeee!")
        var isAnonymous = anonUser.isAnonymous;
        var uid = anonUser.uid;
        chat.setUser(uid, displayName);
        Firechat.createRoom("Live", "public", roomId => {
          console.log(roomId)
        })
        // ...
      } else {
        // User is signed out.
        // ...
      }
      // ...
    });
    // chat.createRoom("Live", "public", roomId => {
    //   console.log(roomId)
    // })
  })
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
        setPlause("Play");
      });
      lwmAudio.current.addEventListener('canplay', () => {
        setCanPlay(true)
      });
      stream.current.addEventListener('error', () => {
        setPlause("Play");
        setCanPlay(false)
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
      lwmAudio.current.pause();
    }
  }

  const createRoom = () => {
    // chat.createRoom(roomName, "public", roomId => {
    //   console.log(roomId)
    // })
  }

  const setRoom = e => {
    setRoomName(e.target.value)
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
          <source ref={stream} src={`http://95.154.196.33:5756/stream?type=.mp3&nocache=${randomCacheNo}`} type="audio/mpeg" />
        </audio>
        <Announcement />
        <TextField onChange={setRoom} value={roomName} />
        <Button onClick={createRoom}>Create Room</Button>
        <div id="firechat-wrapper">
          <div>{displayName}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
