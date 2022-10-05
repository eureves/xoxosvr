import "dotenv/config";
import "./server";
import { initChatListener } from "./twitch/twitch";

initChatListener();
