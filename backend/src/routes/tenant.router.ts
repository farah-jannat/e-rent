import { config } from "@/config";
import {
  archiveTenant,
  deleteTenant,
  editStatus,
  getArchivedTenants,
  getTenant,
  getTenants,
  registerTenant,
  restoreTenant,
  tenantRents,
  updateTenant,
} from "@/controllers/tenant.controller";
import { verifyClientToken } from "@/middlewares/verify-client-token.middleware";
import { verifySubscription } from "@/middlewares/verify-subscription.middleware";
import { Router } from "express";

const tenantRouter = Router();

tenantRouter.post("/", verifyClientToken(config.JWT_TOKEN), verifySubscription, registerTenant);
tenantRouter.get("/", verifyClientToken(config.JWT_TOKEN), getTenants);
tenantRouter.get("/:id", verifyClientToken(config.JWT_TOKEN), getTenant);
tenantRouter.put("/:id", verifyClientToken(config.JWT_TOKEN), verifySubscription, updateTenant);
tenantRouter.delete(`/:id`, verifyClientToken(config.JWT_TOKEN), verifySubscription, deleteTenant);

tenantRouter.get("/archived", verifyClientToken(config.JWT_TOKEN), getArchivedTenants);
tenantRouter.put("/:id/archive", verifyClientToken(config.JWT_TOKEN), verifySubscription, archiveTenant);
tenantRouter.put("/:id/restore", verifyClientToken(config.JWT_TOKEN), verifySubscription, restoreTenant);

tenantRouter.get("/:id/rents", verifyClientToken(config.JWT_TOKEN), tenantRents);
tenantRouter.put("/:id/rents/status", verifyClientToken(config.JWT_TOKEN), verifySubscription, editStatus);

export default tenantRouter;
