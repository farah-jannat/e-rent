import { config } from "@/config";
import { verifyClientToken } from "@/middlewares/verify-client-token.middleware";
import type { SubscriptionController } from "@/services/subscription/subscription.controller";
import { Router } from "express";

export class SubscriptionRouter {
  private handler: SubscriptionController;
  private router: Router;

  constructor(handler: SubscriptionController) {
    this.handler = handler;
    this.router = Router();
  }

  mount(): Router {
    this.router.post("/", verifyClientToken(config.JWT_TOKEN), this.handler.subscribe);
    return this.router;
  }
}
