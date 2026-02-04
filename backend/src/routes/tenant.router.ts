import { config } from "@/config";
import { registerTenant } from "@/controllers/tenant.controller";
import { verifyClientToken } from "@/middlewares/verify-client-token.middleware";
import { Router } from "express";

const tenantRouter = Router();

tenantRouter.post(
  "/register",
  verifyClientToken(config.JWT_TOKEN),
  registerTenant,
);

export default tenantRouter;
