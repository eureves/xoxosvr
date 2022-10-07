import { Server as IOServer, Socket } from "socket.io";
import registerMediaHandler from "./sockets/handlers/mediaHandler";
import registerDashboardHandler from "./sockets/handlers/dashboardHandler";
import type { Server } from "http";
import HKL from "./utils/keylistener";

export const createIoServer = (server: Server) => {
  const io = new IOServer(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  const onConnection = async (socket: Socket) => {
    registerMediaHandler(io, socket);
    registerDashboardHandler(io, socket);
    socket.on("keyHandler", () => {
      HKL.getInstance(io, socket).addListener();
    });
  };

  io.on("connection", onConnection);

  return io;
};
