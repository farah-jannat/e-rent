import { config } from "@/config";
import { getTenants, registerTenant } from "@/controllers/tenant.controller";
import { verifyClientToken } from "@/middlewares/verify-client-token.middleware";
import { Router } from "express";

const tenantRouter = Router();

tenantRouter.post(
  "/register",
  verifyClientToken(config.JWT_TOKEN),
  registerTenant,
);

tenantRouter.get(
  "/tenants",

  verifyClientToken(config.JWT_TOKEN),
  getTenants,
);

export default tenantRouter;
