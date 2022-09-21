declare global {
  namespace NodeJs {
    interface ProcessEnv {
      PORT: string;
      TWITCH_CLIENT_ID: string;
      TWITCH_CLIENT_SECRET: string;
      CHANNEL_NAME: string;
      TWITCH_REDIRECT_URI: string;
    }
  }
}

export {};
