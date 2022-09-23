import ytsr, { Video } from "ytsr";
import { v4 as uuid } from "uuid";
import { Server } from "socket.io";
import DataBase from "../db";

export const addRequest = async (io: Server, user: string, message: string, hidden: boolean) => {
  let requestMessage: string;

  const youtubeUrlRegExp = new RegExp(
    "(?:watch\\?v=|v\\/|embed\\/|ytscreeningroom\\?v=|\\?v=|\\?vi=|e\\/|watch\\?.*vi?=|\\?feature=[a-z_]*&v=|vi\\/)([a-zA-Z0-9\\-\\_]{11})"
  );
  if (message.startsWith("!sr ") || message.startsWith("!vr ")) {
    requestMessage = message.slice(4);
  } else {
    requestMessage = message;
  }

  if (requestMessage.match(youtubeUrlRegExp)) {
    requestMessage = requestMessage.match(youtubeUrlRegExp)[1];
  }

  const filters = await ytsr.getFilters(requestMessage);
  const filter = filters.get("Type")?.get("Video");
  if (filter !== undefined && filter.url) {
    try {
      const result = await ytsr(filter.url, { limit: 1 });
      const { url, title, bestThumbnail, duration, thumbnails } = result.items[0] as Video;
      DataBase.addToRequests({
        id: uuid(),
        requestMessage,
        user,
        url,
        title,
        hidden,
        duration,
        imageUrl: bestThumbnail.url,
        thumbnail: thumbnails[thumbnails.length - 1].url,
      });
      io.emit("media:sent", await DataBase.getNextRequest());
      io.emit("dashboard:sendRequests", await DataBase.getRequests());
    } catch (error) {
      console.log(error);
    }
  }
};
