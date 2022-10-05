import { Server, Socket } from "socket.io";
import DataBase from "../../db";

const mediaHandler = (io: Server, socket: Socket) => {
  socket.on("media:hasEnded", async () => {
    await DataBase.removeRequest();
    io.emit("dashboard:sendRequests", await DataBase.getRequests());
    socket.emit("media:sent", await DataBase.getRequest());
  });

  socket.on("media:get", async () => {
    socket.emit("media:sent", await DataBase.getRequest());
  });
};

export default mediaHandler;
