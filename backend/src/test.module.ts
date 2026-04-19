import type { IAppModule } from "@/interfaces";
import { AuthController } from "@/services/auth/auth.controller";
import { FakeAuthService } from "@/services/auth/auth.fake.service";
import { AuthRouter } from "@/services/auth/auth.router";
import { FakeLandlordService } from "@/services/landlord/landlord.fake.service";
import type { Application } from "express";

export class TestModule implements IAppModule {
  isTest = true;
  public landlordService = new FakeLandlordService();
  public authService = new FakeAuthService(this.landlordService);

  public set_route_middlewares(app: Application) {
    const BASE_PATH = "/api/v1";

    // Services
    // const authService = new FakeAuthService();
    // const flatService = new FlatService(db);
    // const tenantService = new TenantService(db);

    // Controllers
    const authController = new AuthController(this.authService);
    // const flatController = new FlatController(flatService, authService);
    // const tenantController = new TenantController(tenantService);

    // Routers
    app.use(`${BASE_PATH}/auth`, new AuthRouter(authController).mount());
    // app.use(`${BASE_PATH}/flats`, new FlatRouter(flatController).mount());
    // app.use(`${BASE_PATH}/tenants`, new TenantRouter(tenantController).mount());
  }
}
