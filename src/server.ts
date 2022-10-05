import * as url from "url";
import express, { Express, json } from "express";
import { createServer } from "http";
import { join } from "path";
import { createIoServer } from "./io";
import router from "./routers/router";

import cors from "cors";
import { apiRouter } from "./routers/api";

const port = process.env.PORT;
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const expressApp: Express = express();
const httpServer = createServer(expressApp);

expressApp.use(cors());
expressApp.use(json());
expressApp.use("/static", express.static(join(__dirname, "public")));
expressApp.use("/", router);
expressApp.use("/api/1", apiRouter);

httpServer.listen(port, () => {
  console.log(`️Server: running at http://localhost:${port} ✅`);
});

const ioServer = createIoServer(httpServer);

export { httpServer, ioServer };
