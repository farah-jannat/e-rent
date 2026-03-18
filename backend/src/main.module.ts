// src/modules/main.module.ts

import { AuthController } from "@/auth/auth.controller";
import { AuthRouter } from "@/auth/auth.router";
import { AuthService } from "@/auth/auth.service";
import { db } from "@/db";
import { FlatController } from "@/flat/flat.controller";
import { FlatRouter } from "@/flat/flat.router";
import { FlatService } from "@/flat/flat.service";
import type { IAppModule } from "@/interfaces";
import { TenantController } from "@/tenant/tenant.controller";
import { TenantRouter } from "@/tenant/tenant.router";
import { TenantService } from "@/tenant/tenant.service";
import type { Application } from "express";

export class MainModule implements IAppModule {
  public set_route_middlewares(app: Application) {
    const BASE_PATH = "/api/v1";

    // Services
    const authService = new AuthService(db);
    const flatService = new FlatService(db);
    const tenantService = new TenantService(db);

    // Controllers
    const authController = new AuthController(authService);
    const flatController = new FlatController(flatService, authService);
    const tenantController = new TenantController(tenantService);

    // Routers
    app.use(`${BASE_PATH}/auth`, new AuthRouter(authController).mount());
    app.use(`${BASE_PATH}/flats`, new FlatRouter(flatController).mount());
    app.use(`${BASE_PATH}/tenants`, new TenantRouter(tenantController).mount());
  }
}
