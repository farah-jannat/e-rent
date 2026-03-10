import { config } from "@/config";
import type { IAuthService } from "@/interfaces";
import { hashPassword, verifyPassword } from "@/utils/hashing.util";
import type { LoginLandlordInput, RegisterLandlordInput } from "@/validations/landlord.validation";
import { BadRequestError } from "@fvoid/shared-lib";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

export class AuthController {
  constructor(public authService: IAuthService) {}

  register = async (req: Request, res: Response) => {
    const formData = req.body as RegisterLandlordInput;

    const landlord = await this.authService.findByEmail(formData.email);
    if (landlord) throw new Error("you already exist!");

    // hashe the password
    const hashedPassword = await hashPassword(formData.password);
    const registerData: RegisterLandlordInput = {
      ...formData,
      password: hashedPassword,
    };

    // create a landlord
    const insertLandlord = await this.authService.create(registerData);

    // prepare token data
    const payload = {
      id: registerData?.id,
      email: registerData?.email,
      name: registerData?.name,
      exp: Math.floor(Date.now() / 1000) + 24 * 7 * 3600,
    };

    // create token
    const token = jwt.sign(payload, config.JWT_TOKEN);

    // assign token to the cookie
    req.session = { jwt: token };

    // return response
    return res.json({
      message: "Account created successfully",
      token: token,
      user: insertLandlord,
    });
  };

  login = async (req: Request, res: Response) => {
    const formData = req.body as LoginLandlordInput;

    // check for landlord
    const landlord = await this.authService.findByEmail(formData.email);
    if (!landlord) throw new Error("User are not found with this email! -_-");

    // verity password
    const isPasswordValid = await verifyPassword(formData.password, landlord.password);
    if (!isPasswordValid) throw new BadRequestError("Invalid credentials");

    // generate jwt
    const payload = {
      id: landlord?.id,
      email: landlord.email,
      exp: Math.floor(Date.now() / 1000) + 24 * 7 * 3600,
    };
    const token = jwt.sign(payload, config.JWT_TOKEN);
    req.session = { jwt: token };

    // return response
    return res.json({
      message: "User logged in successfully",
      user: landlord,
      token,
    });
  };
}
