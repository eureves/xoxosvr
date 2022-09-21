import express, { Express } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import "dotenv/config";
import router from "./routes/router";
import registerMediaHandler from "./sockets/handlers/mediaHandler";
import registerDashboardHandler from "./sockets/handlers/dashboardHandler";
import { initChatListener } from "./twitch/twitch";

import * as url from "url";
import { join } from "path";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const port = process.env.PORT;

const app: Express = express();
const server = createServer(app);

app.use("/static", express.static(join(__dirname, "public")));

app.use(router);

export const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

initChatListener();

const onConnection = (socket: Socket) => {
  console.log("Socket: connected ✅");

  registerMediaHandler(io, socket);
  registerDashboardHandler(io, socket);
};

io.on("connection", onConnection);

server.listen(port, () => {
  console.log(`️Server: running at http://localhost:${port} ✅`);
});
