import { config } from "@/config";
import { subscribe } from "@/controllers/subscribe.controller";
import { verifyClientToken } from "@/middlewares/verify-client-token.middleware";
import { Router } from "express";

const subscriptionRouter = Router();

subscriptionRouter.post("/", verifyClientToken(config.JWT_TOKEN), subscribe);

export default subscriptionRouter;
