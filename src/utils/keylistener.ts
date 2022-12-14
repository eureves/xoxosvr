import DataBase from "../db";
import {
  GlobalKeyboardListener,
  IGlobalKeyDownMap,
  IGlobalKeyEvent,
} from "node-global-key-listener";
import { Server, Socket } from "socket.io";
import { IGlobalKeyResult } from "node-global-key-listener/build/ts/_types/IGlobalKeyResult";

interface IConfig {
  modifiers: { ctrl: boolean; shift: boolean };
  keys: string;
}

class HotkeyListener {
  private listener: GlobalKeyboardListener;
  private static config: { keys: string; modifiers: { ctrl: boolean; shift: boolean } };
  private static io: Server;
  private static socket: Socket;
  private static instance: HotkeyListener;

  constructor(io: Server, socket: Socket) {
    this.listener = new GlobalKeyboardListener();
    HotkeyListener.io = io;
    HotkeyListener.socket = socket;
    HotkeyListener.instance = this;
  }

  private keyHandler = (e: IGlobalKeyEvent, down: IGlobalKeyDownMap): IGlobalKeyResult => {
    if (e.state === "DOWN" && e.name === HotkeyListener.config.keys) {
      this.removeFromQueue();
      return true;
    }
  };

  private removeFromQueue = () => {
    const removeFromQueueBind = async () => {
      await DataBase.removeRequest();
      HotkeyListener.io.emit("dashboard:sendRequests", await DataBase.getRequests());
      HotkeyListener.io.emit("media:sent", await DataBase.getRequest());
    };
    removeFromQueueBind();
  };

  public static getInstance(
    io: Server = HotkeyListener.io,
    socket: Socket = HotkeyListener.socket
  ): HotkeyListener {
    if (!HotkeyListener.instance) this.instance = new HotkeyListener(io, socket);
    return HotkeyListener.instance;
  }

  public async addListener() {
    if (this.listener) this.listener.removeListener(this.keyHandler);
    HotkeyListener.config = await DataBase.getConfig();
    this.listener.addListener(this.keyHandler);
  }
}

export default HotkeyListener;
