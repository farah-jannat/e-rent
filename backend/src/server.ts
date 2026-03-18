// ** Third Party Imports
import { Server as HttpServer } from "http";
import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";

// ** Local Imports
import { config } from "@/config";
import { getSession } from "@/middlewares/get-session.middleware";
import { initCronJobs, initSubscriptionCron } from "@/cron/cron";
import type { IAppModule } from "@/interfaces";
import { TestModule } from "@/test.module";

export class Server {
  constructor(
    public app: express.Application,
    private module: IAppModule,
  ) {
    // this.module.set_route_middlewares(this.app);
    this.setup();
  }

  public setup() {
    this.set_standard_middlewares();
    this.set_security_middlewares();
    // this.set_route_middlewares();
    this.module.set_route_middlewares(this.app);
  }

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


  public start(PORT: number): HttpServer {
    if (!this.module.isTest) {
      initCronJobs();
      initSubscriptionCron();
    }
    return this.app.listen(PORT, () => {
      console.log(`Erent server is running on port ${PORT}`);
    });
  }
}
