// ** Third Party Imports
import express, { type Application } from "express";
import cors from "cors";
import morgan from "morgan"; // A popular HTTP request logger middleware for node.js
import cookieSession from "cookie-session";

// ** Local Imports
import { config } from "@/config";
import authRouter from "@/routes/auth.router";
import flatRouter from "@/routes/flat.router";
import tenantRouter from "@/routes/tenant.router";
import { getSession } from "@/middlewares/get-session.middleware";
import { initCronJobs, initSubscriptionCron } from "@/cron/cron";
import subscriptionRouter from "@/routes/subscription.router";
import { FlatService } from "@/flat/flat.service";
import { db } from "@/db";
import { FlatController } from "@/flat/flat.controller";
import { FlatRouter } from "@/flat/flat.router";
import { AuthService } from "@/auth/auth.service";
import { AuthController } from "@/auth/auth.controller";
import { AuthRouter } from "@/auth/auth.router";

export class Server {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start() {
    //     this.load_configurations();
    this.set_standard_middlewares();
    this.set_security_middlewares();
    this.set_route_middlewares();
    // this.set_error_middlewares();
    this.start_server();
  }

  //   private load_configurations() {
  //     configureCloudinary({
  //       cloud_name: config.CLOUD_NAME,
  //       api_key: config.CLOUD_API_KEY,
  //       api_secret: config.CLOUD_API_SECRET,
  //     });
  //   }

  private set_standard_middlewares() {
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(express.urlencoded({ limit: "50mb", extended: true })); // For URL-encoded bodies
  }

  private set_security_middlewares() {
    this.app.set("trust proxy", 1);
    this.app.use(
      cookieSession({
        name: "session",
        keys: [config.SECRET_KEY_ONE],
        maxAge: 24 * 7 * 3600 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      }),
    );
    this.app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      }),
    );

    this.app.use(getSession);
    // this.app.use(verifyGatewayToken(config.GATEWAY_JWT_TOKEN, "auth"));
  }

  private set_route_middlewares() {
    this.app.use(morgan("dev"));
    const BASE_PATH = "/api/v1";
    this.app.use(`${BASE_PATH}/tenants`, tenantRouter);
    this.app.use(`${BASE_PATH}/subscriptions`, subscriptionRouter);

    // ===

    const authService = new AuthService(db);
    const flatService = new FlatService(db);

    const authController = new AuthController(authService);
    const flatController = new FlatController(flatService, authService);

    const authRouter = new AuthRouter(authController);
    const flatRouter = new FlatRouter(flatController);

    this.app.use(`${BASE_PATH}/auth`, authRouter.mount());
    this.app.use(`${BASE_PATH}/flats`, flatRouter.mount());
  }

  // private set_error_middlewares() {
  //   this.app.use("*", function (req, res, next) {
  //     next(new NotFoundError());
  //   });

  //   this.app.use(errorHandler);
  // }

  private start_server() {
    initCronJobs();
    initSubscriptionCron();

    const PORT = 4001;
    this.app.listen(PORT, () => {
      console.log(`Erent server is running on port ${PORT}`);
    });
  }
}
