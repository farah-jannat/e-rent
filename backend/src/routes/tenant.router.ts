import { config } from "@/config";
import {
  archiveTenant,
  deleteTenant,
  getArchivedTenants,
  getTenant,
  getTenants,
  registerTenant,
  restoreTenant,
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

tenantRouter.put(
  "/:id",

  verifyClientToken(config.JWT_TOKEN),

  archiveTenant,
);

tenantRouter.get(
  "/archive",

  verifyClientToken(config.JWT_TOKEN),

  getArchivedTenants,
);

tenantRouter.delete(
  `/:id`,

  verifyClientToken(config.JWT_TOKEN),
  deleteTenant,
);

tenantRouter.put(
  "/archive/:id",

  verifyClientToken(config.JWT_TOKEN),
  restoreTenant,
);

export default tenantRouter;
