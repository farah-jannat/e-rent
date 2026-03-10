import type { AuthController } from "@/auth/auth.controller";
import { Router } from "express";

export class AuthRouter {
  private handler: AuthController;
  private router: Router;

  constructor(handler: AuthController) {
    this.handler = handler;
    this.router = Router();
  }

  mount(): Router {
    console.log("@@@@@@@@@@@@ ", this.handler.register);
    this.router.post("/register", this.handler.register);
    this.router.post(`/login`, this.handler.login);

    return this.router;
  }
}
