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
  const Bpubsub = new BasicPubSubClient({});
  const pubsub = new PubSubClient(Bpubsub);

  const userId = await pubsub.registerUserListener(authProvider);

  Bpubsub.connect();
  Bpubsub.onConnect(() => console.log("Pubsub: connected ✅"));

  const listener = await pubsub.onRedemption(userId, (message) => {
    console.log(message.rewardId);
    if (message.rewardId === "6838e09d-37aa-47de-9920-8fd517b096f1") {
      addRequest(io, message.userName, message.message, true);
    } else if (message.rewardId === "") {
      addRequest(io, message.userName, message.message, false);
    }
  });

  // const channel = await twitchApi.users.getMe().then((res) => res.name);
  // const chatClient = new ChatClient({ authProvider, channels: [channel] });
  // await chatClient.connect().then(() => console.log("Chat: connected ✅"));

  // chatClient.onMessage((channel, user, message) => {
  //   if (message.startsWith("!sr")) {
  //     addRequest(io, user, message, true);
  //   } else if (message.startsWith("!vr")) {
  //     addRequest(io, user, message, false);
  //   }
  // });
};
