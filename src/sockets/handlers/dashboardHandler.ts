import { Server, Socket } from "socket.io";
import DataBase from "../../db";

const db = DataBase;

const dashboardHandler = (io: Server, socket: Socket) => {
  socket.on("dashboard:getRequests", async () => {
    socket.emit("dashboard:sendRequests", await db.getRequests());
  });

  socket.on("dashboard:removeRequest", async (id: string) => {
    await db.removeFromRequests(id);
    socket.emit("dashboard:sendRequests", await db.getRequests());
    io.emit("media:sent", await DataBase.getNextRequest());
  });
};

export default dashboardHandler;
