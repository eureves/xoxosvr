import { RefreshingAuthProvider } from "@twurple/auth";
import { BasicPubSubClient, PubSubClient } from "@twurple/pubsub";
import { ApiClient } from "@twurple/api";
import { ChatClient } from "@twurple/chat";
import DataBase from "../db";
import { ioServer } from "../server";
import { addRequest } from "../utils/youtube";

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;

export const initChatListener = async () => {
  const tokenData = await DataBase.getToken();

  if (!tokenData) return;

  const authProvider = new RefreshingAuthProvider(
    {
      clientId,
      clientSecret,
      onRefresh: async (token) => {
        DataBase.setToken(token);
      },
    },
    tokenData
  );

  const twitchApi = new ApiClient({ authProvider });
  const Bpubsub = new BasicPubSubClient({});
  const pubsub = new PubSubClient(Bpubsub);

  const userId = await pubsub.registerUserListener(authProvider);

  Bpubsub.connect();
  Bpubsub.onConnect(() => console.log("Pubsub: connected ✅"));

  const twitchMe = await twitchApi.users.getMe();

  await DataBase.setUser({ name: twitchMe.name });

  const channel = twitchMe.name;
  const chatClient = new ChatClient({ authProvider, channels: [channel] });
  await chatClient.connect().then(() => console.log("Chat: connected ✅"));

  const listener = await pubsub.onRedemption(userId, async (message) => {
    let responseMessage: string;
    if (message.rewardId === process.env.TWITCH_SR_REWARD) {
      responseMessage = await addRequest(ioServer, message.userName, message.message, true);
    }
    chatClient.say(channel, responseMessage);
  });

  chatClient.onMessage(async (channel, user, message) => {
    let responseMessage: string;
    if (message.startsWith("!sr")) {
      responseMessage = await addRequest(ioServer, user, message, true);
    } else if (message.startsWith("!vr")) {
      responseMessage = await addRequest(ioServer, user, message, false);
    }
    chatClient.say(channel, responseMessage);
  });
};
