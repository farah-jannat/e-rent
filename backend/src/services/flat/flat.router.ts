import { config } from "@/config";
import { deleteFlat, getFlats, registerFlat } from "@/controllers/flat.controller";
import { verifyClientToken } from "@/middlewares/verify-client-token.middleware";
import { verifySubscription } from "@/middlewares/verify-subscription.middleware";
import type { FlatController } from "@/services/flat/flat.controller";
import { Router } from "express";

const flatRouter = Router();

flatRouter.post("/", verifyClientToken(config.JWT_TOKEN), verifySubscription, registerFlat);
flatRouter.get("/", verifyClientToken(config.JWT_TOKEN), getFlats);
flatRouter.delete("/:id", verifyClientToken(config.JWT_TOKEN), verifySubscription, deleteFlat);

// flatRouter.post("/register",  registerFlat);

export default flatRouter;

// ===

export class FlatRouter {
  private handler: FlatController;
  private router: Router;

  constructor(handler: FlatController) {
    this.handler = handler;
    this.router = Router();
  }

  mount(): Router {
    console.log("it will fetch the first flat");

    this.router.post("/", verifyClientToken(config.JWT_TOKEN), verifySubscription, this.handler.registerFlat);
    // this.router.get("/", verifyClientToken(config.JWT_TOKEN), getFlats);
    // this.router.delete("/:id", verifyClientToken(config.JWT_TOKEN), verifySubscription, deleteFlat);
    return this.router;
  }
}
