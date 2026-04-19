import { config } from "@/config";
import { deleteFlat, getFlats, registerFlat } from "@/controllers/flat.controller";
import { verifyClientToken } from "@/middlewares/verify-client-token.middleware";
import { verifySubscription } from "@/middlewares/verify-subscription.middleware";
import type { TenantController } from "@/services/tenant/tenant.controller";
import { Router } from "express";

const flatRouter = Router();

flatRouter.post("/", verifyClientToken(config.JWT_TOKEN), verifySubscription, registerFlat);
flatRouter.get("/", verifyClientToken(config.JWT_TOKEN), getFlats);
flatRouter.delete("/:id", verifyClientToken(config.JWT_TOKEN), verifySubscription, deleteFlat);

// flatRouter.post("/register",  registerFlat);

export default flatRouter;

// ===

export class TenantRouter {
  private handler: TenantController;
  private router: Router;

  constructor(handler: TenantController) {
    this.handler = handler;
    this.router = Router();
  }

  mount(): Router {
    this.router.post("/", verifyClientToken(config.JWT_TOKEN), verifySubscription, this.handler.registerTenant);
    this.router.get("/", verifyClientToken(config.JWT_TOKEN), this.handler.getTenants);
    this.router.get("/:id", verifyClientToken(config.JWT_TOKEN), this.handler.getTenant);
    this.router.put("/:id", verifyClientToken(config.JWT_TOKEN), verifySubscription, this.handler.updateTenant);
    this.router.delete(`/:id`, verifyClientToken(config.JWT_TOKEN), verifySubscription, this.handler.deleteTenant);

    this.router.get("/archived", verifyClientToken(config.JWT_TOKEN), this.handler.getArchivedTenants);
    this.router.put("/:id/archive", verifyClientToken(config.JWT_TOKEN), verifySubscription, this.handler.archiveTenant);
    this.router.put("/:id/restore", verifyClientToken(config.JWT_TOKEN), verifySubscription, this.handler.restoreTenant);

    // this.router.get("/:id/rents", verifyClientToken(config.JWT_TOKEN), this.handler.tenantRents);
    // this.router.put("/:id/rents/status", verifyClientToken(config.JWT_TOKEN), verifySubscription, this.handler.editStatus);

    return this.router;
  }
}
