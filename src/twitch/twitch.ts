import { RefreshingAuthProvider } from "@twurple/auth";
import { BasicPubSubClient, PubSubClient } from "@twurple/pubsub";
import { ApiClient } from "@twurple/api";
import { ChatClient } from "@twurple/chat";
import DataBase from "../db";
import { io } from "../index";
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
  // const Bpubsub = new BasicPubSubClient({});
  // const pubsub = new PubSubClient(Bpubsub);

  // const userId = await pubsub.registerUserListener(authProvider);

  // Bpubsub.connect();

  // pubsub.onRedemption(userId, () => {
  //   console.log("oof");
  // });

  const channel = await twitchApi.users.getMe().then((res) => res.name);
  const chatClient = new ChatClient({ authProvider, channels: [channel] });
  await chatClient.connect().then(() => console.log("Chat: connected ✅"));

  chatClient.onMessage((channel, user, message) => {
    if (message.startsWith("!sr")) {
      addRequest(io, user, message, true);
    } else if (message.startsWith("!vr")) {
      addRequest(io, user, message, false);
    }
  });
};
