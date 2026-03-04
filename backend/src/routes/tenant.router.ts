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

tenantRouter.post("/register", verifyClientToken(config.JWT_TOKEN), verifySubscription, registerTenant);
tenantRouter.get("/tenants", verifyClientToken(config.JWT_TOKEN), getTenants);
tenantRouter.get("/tenants/:id", verifyClientToken(config.JWT_TOKEN), getTenant);
tenantRouter.put("/", verifyClientToken(config.JWT_TOKEN), verifySubscription, updateTenant);
tenantRouter.put("/:id", verifyClientToken(config.JWT_TOKEN), verifySubscription, archiveTenant);
tenantRouter.get("/archive", verifyClientToken(config.JWT_TOKEN), getArchivedTenants);
tenantRouter.delete(`/:id`, verifyClientToken(config.JWT_TOKEN), verifySubscription, deleteTenant);
tenantRouter.put("/archive/:id", verifyClientToken(config.JWT_TOKEN), verifySubscription, restoreTenant);
tenantRouter.get("/rents/:id", verifyClientToken(config.JWT_TOKEN), tenantRents);
tenantRouter.put("/rents/:id", verifyClientToken(config.JWT_TOKEN), verifySubscription, editStatus);

export default tenantRouter;
