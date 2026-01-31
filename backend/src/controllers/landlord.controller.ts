import { config } from "@/config";
import { db } from "@/db";
import { landlords } from "@/schemas";
import { hashPassword, verifyPassword } from "@/utils/hashing.util";
import type {
  LoginLandlordInput,
  RegisterLandlordInput,
} from "@/validations/landlord.validation";
import { BadRequestError, catchError } from "@fvoid/shared-lib";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  const formData = req.body as RegisterLandlordInput;

  console.log("formdata email", formData.email);
  const [landlordError, landlord] = await catchError(
    db.query.landlords.findFirst({
      where: eq(landlords.email, formData.email),
    }),
  );
  if (landlordError) throw new Error("DB error!");

  if (landlord) {
    throw new Error("you already exist!");
  } else {
    const hashedPassword = await hashPassword(formData.password);
    const registerData: RegisterLandlordInput = {
      ...formData,
      password: hashedPassword,
    };
    console.log("registered data", registerData);

    const [insertLandlordError, insertLandlord] = await catchError(
      db.insert(landlords).values(registerData),
    );
    if (insertLandlordError) throw new Error("Db error inserting");

    const payload = {
      id: registerData?.id,
      email: registerData?.email,
      name: registerData?.name,
      exp: Math.floor(Date.now() / 1000) + 24 * 7 * 3600,
    };

    const token = jwt.sign(payload, config.JWT_TOKEN);

    req.session = { jwt: token };
    return res.json({
      message: "Account created successfully",
      token: token,
      user: insertLandlord,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const formData = req.body as LoginLandlordInput;
  console.log("form data fro loggin landlord", formData);

  const [landlordError, landlord] = await catchError(
    db.query.landlords.findFirst({
      where: eq(landlords?.email, formData?.email),
    }),
  );

  if (landlordError) throw new Error("DB error!");

  if (!landlord) {
    throw new Error("User are not found with this email! -_-");
  } else {
    const isPasswordValid = await verifyPassword(
      formData.password,
      landlord.password,
    );
    if (!isPasswordValid) throw new BadRequestError("Invalid credentials");
    // Generate jwt
    const payload = {
      id: landlord?.id,
      email: landlord.email,
      exp: Math.floor(Date.now() / 1000) + 24 * 7 * 3600,
    };

    const token = jwt.sign(payload, config.JWT_TOKEN);

    req.session = { jwt: token };
    return res.json({
      message: "User logged in successfully",
      user: landlord,
      token,
    });
  }
};
