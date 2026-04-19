
import { config } from "@/config";
import type { IAuthService, ILandlordService } from "@/interfaces";
import { hashPassword, verifyPassword } from "@/utils/hashing.util";
import type { LoginLandlordInput, RegisterLandlordInput } from "@/validations/landlord.validation";
import { BadRequestError } from "@fvoid/shared-lib";
import jwt from "jsonwebtoken";

export class FakeAuthService implements IAuthService {
  constructor(
    public landlordService: ILandlordService,
  ) {}

  async register(formData: RegisterLandlordInput) {
    const landlord = await this.landlordService.findByEmail(formData.email);
    if (landlord) throw new Error("you already exist!");

    // hash the password
    const hashedPassword = await hashPassword(formData.password);
    const registerData: RegisterLandlordInput = {
      ...formData,
      password: hashedPassword,
    };

    // create a landlord
    const insertLandlord = await this.landlordService.create(registerData);

    // prepare token data
    const payload = {
      id: registerData?.id,
      email: registerData?.email,
      name: registerData?.name,
      exp: Math.floor(Date.now() / 1000) + 24 * 7 * 3600,
    };

    // create token
    const token = jwt.sign(payload, config.JWT_TOKEN);

    return { token, landlord: insertLandlord };
  }

  async login(formData: LoginLandlordInput) {
    // check for landlord
    const landlord = await this.landlordService.findByEmail(formData.email);
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

    return { token, landlord: landlord };
  }
}

// const hi = ()=> {
//   // const landlord = await this.landlordService.findByEmail(formData.email);
//   // if (landlord) throw new Error("you already exist!");
//   return new Error("you already exist!");
// };

