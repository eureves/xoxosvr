import type { AccessToken } from "@twurple/auth";
import { JsonDB, Config } from "node-json-db";

interface IRequest {
  id: string;
  requestMessage: string;
  user: string;
  url: string;
  title: string;
  hidden: boolean;
  duration?: string | null;
  imageUrl?: string | null;
  thumbnail: string;
}

interface IConfig {
  modifiers: { ctrl: boolean; shift: boolean };
  keys: string;
}

class DataBase {
  private db: JsonDB;
  private static instance: DataBase;

  constructor() {
    this.db = new JsonDB(new Config("data", true, false, "/"));
    DataBase.instance = this;
  }

  public static getInstance(): DataBase {
    if (!DataBase.instance) this.instance = new DataBase();
    return DataBase.instance;
  }

  public async setToken(userToken: AccessToken) {
    await this.db.push("/userToken", userToken);
    await this.db.push("/requests", []);
  }

  public async getToken(): Promise<AccessToken> {
    try {
      return await this.db.getObject<AccessToken>("/userToken");
    } catch (error) {
      console.log(`${error} - missing token`);
    }
  }

  public async getRequest(): Promise<IRequest> | null {
    if ((await this.db.count("/requests")) !== 0) {
      return this.db.getObject<IRequest>("/requests[0]");
    } else {
      return null;
    }
  }

  public async addToRequests(request: IRequest) {
    await this.db.push("/requests[]", request);
  }

  public async removeRequest(id?: string) {
    if (await this.db.count("/requests")) {
      if (id) {
        await this.db.delete("/requests[" + (await this.db.getIndex("/requests", id)) + "]");
      } else {
        await this.db.delete("/requests[0]");
      }
    }
  }

  public async getRequests(): Promise<IRequest[]> {
    return this.db.getData("/requests");
  }

  public async setUser(user: { name: string }) {
    await this.db.push("/user", user);
  }

  public async getUser(): Promise<{ name: string } | null> {
    try {
      return await this.db.getData("/user");
    } catch (error) {
      return null;
    }
  }

  public async setConfig(config: IConfig) {
    await this.db.push("/config", config);
  }

  public async getConfig(): Promise<IConfig> {
    try {
      return await this.db.getObject<IConfig>("/config");
    } catch (error) {
      console.log(`${error} - missing token`);
    }
  }
}

export default DataBase.getInstance();
