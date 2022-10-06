import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Slider from "rc-slider";
import "./App.css";
import "rc-slider/assets/index.css";

const serverUrl = "http://localhost:8000";

const App = () => {
  const [socket, setSocket] = useState(null);
  const [requests, setRequests] = useState([]);
  const [playing, setPlaying] = useState(false);

  const [volumeRange, setVolumeRange] = useState(localStorage.getItem("volume"));
  const [progressRange, setProgressRange] = useState(0);

  useEffect(() => {
    fetch(serverUrl + "/api/1/requests")
      .then((res) => res.json())
      .then((res) => setRequests(res))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const newSocket = io(`http://localhost:8000`);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  useEffect(() => {
    if (socket) {
      socket.on("dashboard:sendRequests", (requests) => {
        console.log(requests);
        setRequests(requests);
      });
      socket.on("dashboard:playerComponent", ({ volumeRange, progressRange }) => {
        setProgressRange(progressRange);
        setVolumeRange(volumeRange);
      });
      socket.on("dashboard:progressChange", (progress) => {
        setProgressRange(progress);
      });
    }
  }, [socket]);

  const handleVolumeChange = (volume) => {
    setVolumeRange(volume);
    localStorage.setItem("volume", +volume);
    socket.emit("dashboard:volume", volume);
  };

  const handlePlayPause = () => {
    setPlaying((state) => !state);
    socket.emit("dashboard:playing", playing);
  };

  const handleProgressChange = (progress) => {
    setProgressRange(progress);
    socket.emit("dashboard:progress", progress);
  };

  const deleteRequest = (id = null) => {
    socket.emit("dashboard:removeRequest", id);
  };

  const createRequests = (requests) => {
    return (
      <ul>
        {requests.map((e) => {
          return (
            <li
              key={e.id}
              className="flex items-center gap-2 rounded-xl my-1 pr-1 pl-1 text-black text-sm sm:text-xl"
            >
              <p>{e.hidden ? "S" : "V"}</p>
              <a className="hidden xxs:block xxs:shrink-0" href={e.url}>
                <img
                  className="object-cover w-8 h-8 sm:w-20 sm:h-20"
                  src={e.thumbnail}
                  alt={e.title}
                />
              </a>
              <div className="shrink overflow-hidden">
                <p className="overflow-hidden overflow-ellipsis">{e.user}</p>
                <p className="overflow-hidden overflow-ellipsis whitespace-nowrap text-xs sm:text-lg">
                  {e.title}
                </p>
              </div>
              <button
                className="ml-auto shrink-0 w-9 h-9 rounded-full bg-rose-900 hover:bg-rose-400 hover:text-black"
                onClick={() => deleteRequest(e.id)}
              >
                <p>X</p>
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    socket &&
    requests && (
      <>
        <div>
          <div className="flex gap-2 mx-2">
            <div className="flex flex-col text-center cursor-pointer">
              <p onClick={() => handlePlayPause()}>{playing ? "Play" : "Stop"}</p>
              <p onClick={() => deleteRequest()}>Skip</p>
            </div>
            <div className="flex flex-col gap-2 flex-1 shrink justify-center">
              {[
                { key: "progress", value: progressRange, onChange: handleProgressChange },
                { key: "volume", value: volumeRange, onChange: handleVolumeChange },
              ].map((slider) => {
                return (
                  <div key={slider.key} className="flex items-center gap-2 ">
                    <Slider value={slider.value} onChange={slider.onChange} step={0.1} />
                  </div>
                );
              })}
            </div>
          </div>
          {createRequests(requests)}
        </div>
      </>
    )
  );
};

export default App;
