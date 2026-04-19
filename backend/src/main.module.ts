// src/modules/main.module.ts

import { db } from "@/db";
import type { IAppModule } from "@/interfaces";
import { AuthController } from "@/services/auth/auth.controller";
import { AuthRouter } from "@/services/auth/auth.router";
import { AuthService } from "@/services/auth/auth.service";
import { FlatController } from "@/services/flat/flat.controller";
import { FlatRouter } from "@/services/flat/flat.router";
import { FlatService } from "@/services/flat/flat.service";
import { LandlordService } from "@/services/landlord/landlord.service";
import { TenantController } from "@/services/tenant/tenant.controller";
import { TenantRouter } from "@/services/tenant/tenant.router";
import { TenantService } from "@/services/tenant/tenant.service";
import type { Application } from "express";

export class MainModule implements IAppModule {
  public set_route_middlewares(app: Application) {
    const BASE_PATH = "/api/v1";

    // Services

    const landlordService = new LandlordService(db);
    const authService = new AuthService(landlordService);
    const flatService = new FlatService(db);
    const tenantService = new TenantService(db);

    // Controllers
    const authController = new AuthController(authService);
    const flatController = new FlatController(flatService, landlordService);
    const tenantController = new TenantController(tenantService);

    // Routers
    app.use(`${BASE_PATH}/auth`, new AuthRouter(authController).mount());
    app.use(`${BASE_PATH}/flats`, new FlatRouter(flatController).mount());
    app.use(`${BASE_PATH}/tenants`, new TenantRouter(tenantController).mount());
  }
}
