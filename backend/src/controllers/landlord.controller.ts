import { db } from "@/db";
import { landlords } from "@/schemas";
import { hashPassword } from "@/utils/hashing.util";
import type { RegisterLandlordInput } from "@/validations/landlord.validation";
import { catchError } from "@fvoid/shared-lib";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  const formData = req.body as RegisterLandlordInput;

  console.log("formdata email", formData.email)
  const [landlordError, landlord] = await catchError(
    db.query.landlords.findFirst({
      where: eq(landlords.email, formData.email),
    }),
  );
  if (landlordError) throw new Error("DB error!");

  if (landlord) {
    throw new Error("you already exist!");
  }
  
  else {

    const hashedPassword = await hashPassword(formData.password);
    const registerData: RegisterLandlordInput = {
      ...formData,
      password: hashedPassword,
    };
    console.log("registered data", registerData)

    const [insertLandlordError, insertLandlord] = await catchError(
      db.insert(landlords).values(registerData),
    );
    if (insertLandlordError) throw new Error("Db error inserting");

    return res.json({
      message: "Account created successfully",
      user: insertLandlord,
    });
  }
};
