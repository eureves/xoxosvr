import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ReactPlayer from "react-player";
import ProgressIcon from "./Components/Progress";
import "./App.css";

function SongRequest() {
  const [socket, setSocket] = useState(null);
  const [media, setMedia] = useState(null);
  const [localProgress, setLocalProgress] = useState(0);

  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:8000`);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  useEffect(() => {
    if (socket) {
      socket.emit("media:get");
      socket.on("media:sent", (req) => {
        setMedia(req);
      });
    }
  }, [socket]);

  function handleVideoEnd() {
    setLocalProgress(0);
    setMedia({ hidden: false });
    socket.emit("media:hasEnded");
  }

  function handlePlayerProgress(progress) {
    const { played } = progress;
    setLocalProgress(played * 100);
  }

  return (
    <>
      {socket && media && (
        <>
          {media.hidden ? (
            <div
              className="player"
              style={media.hidden ? { visibility: "visible" } : { visibility: "hidden" }}
            >
              <ProgressIcon size={250} played={localProgress} image={media.imageUrl}></ProgressIcon>
              <h1 className="player-title">{media.title}</h1>
            </div>
          ) : null}
          <ReactPlayer
            className={media.hidden ? "shrink" : ""}
            url={media.url}
            width={"100vw"}
            height={"100vh"}
            playing
            onProgress={handlePlayerProgress}
            onEnded={handleVideoEnd}
            progressInterval={100}
          />
        </>
      )}
    </>
  );
}

export default SongRequest;
