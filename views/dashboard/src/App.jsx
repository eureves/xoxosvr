import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const App = () => {
  const [socket, setSocket] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:8000`);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  useEffect(() => {
    if (socket) {
      socket.emit("dashboard:getRequests");
      socket.on("dashboard:sendRequests", (requests) => {
        console.log(requests);
        setRequests(requests);
      });
    }
  }, [socket]);

  const deleteRequest = (id) => {
    socket.emit("dashboard:removeRequest", id);
  };

  return (
    socket &&
    requests && (
      <>
        <div className="container mx-auto">
          {
            <ul>
              {requests.map((e) => {
                return (
                  <li
                    key={e.id}
                    className="flex items-center gap-2 rounded-xl m-1 pr-1 pl-1 text-black text-sm"
                  >
                    <p className="xs:relative absolute">{e.hidden ? "S" : "V"}</p>
                    <img
                      className="object-cover w-8 h-8 sm:w-20 sm:h-20"
                      src={e.thumbnail}
                      alt=""
                    ></img>
                    <p className="overflow-hidden overflow-ellipsis whitespace-nowrap">{e.title}</p>
                    <p>{e.user}</p>
                    <button
                      className="ml-auto shrink-0 w-9 h-9 text-white rounded-full bg-rose-900 hover:bg-rose-400 hover:text-black"
                      onClick={() => deleteRequest(e.id)}
                    >
                      <p>X</p>
                    </button>
                  </li>
                );
              })}
            </ul>
          }
        </div>
      </>
    )
  );
};

export default App;
