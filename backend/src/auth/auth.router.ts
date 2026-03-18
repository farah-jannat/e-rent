import type { AuthController } from "@/auth/auth.controller";
import { loginLandlordSchema } from "@/validations/landlord.validation";
import { validateData } from "@fvoid/shared-lib";
import { Router } from "express";

export class AuthRouter {
  private handler: AuthController;
  private router: Router;

  constructor(handler: AuthController) {
    this.handler = handler;
    this.router = Router();
  }

  mount(): Router {
    this.router.post("/register", this.handler.register);
    this.router.post(`/login`, this.handler.login);
    // this.router.post(`/login`,validateData(loginLandlordSchema), this.handler.login);

    return this.router;
  }
}
