import { Server, Socket } from "socket.io";
import DataBase from "../../db";

const dashboardHandler = (io: Server, socket: Socket) => {
  socket.on("dashboard:getRequests", async () => {
    socket.emit("dashboard:sendRequests", await DataBase.getRequests());
  });

  socket.on("dashboard:removeRequest", async (id: string) => {
    await DataBase.removeFromRequests(id);
    socket.emit("dashboard:sendRequests", await DataBase.getRequests());
    io.emit("media:sent", await DataBase.getNextRequest());
  });

  socket.on("dashboard:volume", (volume = 0.25) => {
    io.emit("player:playerVolume", volume);
  });

  socket.on("dashboard:progress", (progress) => {
    io.emit("player:playerProgress", progress / 100);
  });

  socket.on("player:progressChange", (progress) => {
    io.emit("dashboard:progressChange", progress * 100);
  });
};

export default dashboardHandler;
