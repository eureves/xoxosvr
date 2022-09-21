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
  }

  public async getToken(): Promise<AccessToken> {
    try {
      return await this.db.getObject<AccessToken>("/userToken");
    } catch (error) {
      console.log(`${error} - missing token`);
    }
  }

  public async getNextRequest(): Promise<IRequest> | null {
    if ((await this.db.count("/requests")) !== 0) {
      return this.db.getObject<IRequest>("/requests[0]");
    } else {
      return null;
    }
  }

  public async addToRequests(request: IRequest) {
    await this.db.push("/requests[]", request);
  }

  public async removeFromRequests(id?: string) {
    if (id) {
      await this.db.delete("/requests[" + (await this.db.getIndex("/requests", id)) + "]");
    } else {
      await this.db.delete("/requests[0]");
    }
  }

  public getRequests(): Promise<IRequest[]> {
    return this.db.getData("/requests");
  }
}

export default DataBase.getInstance();
