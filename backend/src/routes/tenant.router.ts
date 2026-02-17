import { config } from "@/config";
import {
  getTenant,
  getTenants,
  registerTenant,
  updateTenant,
} from "@/controllers/tenant.controller";
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
tenantRouter.get(
  "/tenants/:id",

  verifyClientToken(config.JWT_TOKEN),
  getTenant,
);

tenantRouter.put(
  "/",

  verifyClientToken(config.JWT_TOKEN),

  updateTenant,
);

export default tenantRouter;
