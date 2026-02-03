import { config } from "@/config";
import {
  deleteFlat,
  getFlats,
  registerFlat,
} from "@/controllers/flat.controller";
import { verifyClientToken } from "@/middlewares/verify-client-token.middleware";
import { Router } from "express";

const flatRouter = Router();

flatRouter.post("/register", verifyClientToken(config.JWT_TOKEN), registerFlat);
flatRouter.get("/flats", verifyClientToken(config.JWT_TOKEN), getFlats);
flatRouter.delete("/:id", verifyClientToken(config.JWT_TOKEN), deleteFlat);

// flatRouter.post("/register",  registerFlat);

export default flatRouter;
