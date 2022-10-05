import { Router } from "express";
import DataBase from "../db";
import HKL from "../utils/keylistener";

export const apiRouter = Router({});

apiRouter.get("/user", async (req, res) => {
  res.json(await DataBase.getUser());
});

apiRouter.get("/requests", async (req, res) => {
  res.json(await DataBase.getRequests());
});

apiRouter.get("/request", async (req, res) => {
  res.json(await DataBase.getRequest());
});

apiRouter.get("/config", async (req, res) => {
  res.json(await DataBase.getConfig());
});

apiRouter.post("/config", async (req, res) => {
  await DataBase.setConfig(req.body);
  HKL.getInstance().addListener();
});
