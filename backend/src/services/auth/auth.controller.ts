import type { IAuthService } from "@/interfaces";
import type { LoginLandlordInput, RegisterLandlordInput } from "@/validations/landlord.validation";
import type { Request, Response } from "express";

export class AuthController {
  constructor(public authService: IAuthService) {}

  register = async (req: Request, res: Response) => {
    const formData = req.body as RegisterLandlordInput;

    const cred = await this.authService.register(formData);

    // assign token to the cookie
    req.session = { jwt: cred?.token };

    // return response
    return res.status(201).json({
      message: "Account created successfully",
      token: cred?.token,
      user: cred?.landlord,
    });
  };

  login = async (req: Request, res: Response) => {
    const formData = req.body as LoginLandlordInput;

    const cred = await this.authService.login(formData);

    // check for landlord
    req.session = { jwt: cred?.token };

    // return response
    return res.json({
      message: "User logged in successfully",
      user: cred?.landlord,
      token: cred?.token,
    });
  };
}
