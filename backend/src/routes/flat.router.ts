import { config } from "@/config";
import { registerFlat } from "@/controllers/flat.controller";
import { verifyClientToken } from "@/middlewares/verify-client-token.middleware";
import { Router } from "express";

const flatRouter = Router();

// flatRouter.post("/register", verifyClientToken(config.JWT_TOKEN), registerFlat);

flatRouter.post("/register",  registerFlat);

export default flatRouter;
