import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ReactPlayer from "react-player";
import ProgressIcon from "./Components/Progress";
// import "./App.css";
import { useRef } from "react";

function SongRequest() {
  const [socket, setSocket] = useState(null);
  const [media, setMedia] = useState(null);
  const playerRef = useRef(null);

  const [volumeRange, setVolumeRange] = useState(0.5);
  const [progressRange, setProgressRange] = useState(0);

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
      socket.on("dashboard:playerVolume", (volume) => {
        setVolumeRange(volume / 100);
      });
      socket.on("dashboard:playerProgress", (progress) => {
        playerRef.current.seekTo(progress, "fraction");
        setProgressRange(progress);
      });
    }
  }, [socket]);

  function handleVideoEnd() {
    setProgressRange(0);
    setMedia({ hidden: false });
    socket.emit("media:hasEnded");
  }

  function handlePlayerProgress(progress) {
    const { played } = progress;
    socket.emit("player:progressChange", played);
    setProgressRange(played * 100);
  }

  return (
    <>
      {socket && media && (
        <>
          {media.hidden ? (
            <div
              className="flex flex-col h-screen w-screen absolute items-center justify-center"
              style={media.hidden ? { visibility: "visible" } : { visibility: "hidden" }}
            >
              <ProgressIcon size={500} played={progressRange} image={media.imageUrl}></ProgressIcon>
              <p className="text-9xl text-screen mt-10 font-bold text-white text-center drop-shadow-[0_5px_5px_rgba(0,0,0,1)]">
                {media.title}
              </p>
            </div>
          ) : null}
          <ReactPlayer
            ref={playerRef}
            className={media.hidden ? "hidden" : ""}
            url={media.url}
            width={"100vw"}
            height={"100vh"}
            volume={volumeRange}
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
