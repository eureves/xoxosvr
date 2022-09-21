import { Router, Request, Response } from "express";
import { exchangeCode } from "@twurple/auth";
import { initChatListener } from "../twitch/twitch";
import DataBase from "../db";
import * as url from "url";
import { join } from "path";
const __dirname = url.fileURLToPath(new URL("../", import.meta.url));

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;
const twitchRedirect = process.env.TWITCH_REDIRECT_URI;

const router = Router({});

router.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

router.get("/widget", (req: Request, res: Response) => {
  res.sendFile(join(__dirname, "public", "svrwidget", "index.html"));
});

router.get("/dashboard", (req: Request, res: Response) => {
  res.sendFile(join(__dirname, "public", "dashboard", "index.html"));
});

router.get("/oauth/twitch", async (req, res) => {
  const code = req.query.code;
  if (!code) {
    res.status(400).end();
    return;
  }

  const accessToken = await exchangeCode(clientId, clientSecret, code.toString(), twitchRedirect);

  DataBase.setToken(accessToken);

  initChatListener();

  res.redirect("/");
});

router.get("/auth", (req, res) => {
  res.redirect(
    `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.TWITCH_CLIENT_ID}&redirect_uri=${process.env.TWITCH_REDIRECT_URI}&response_type=code&scope=chat:read+chat:edit`
  );
});

export default router;
