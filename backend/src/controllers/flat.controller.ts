import { db } from "@/db";
import { flats } from "@/schemas";
import type { RegisterFlatInput } from "@/validations/flat.validation";
import { catchError, NotAuthorizedError } from "@fvoid/shared-lib";
import { and, eq } from "drizzle-orm";
import type { Request, Response } from "express";

export const registerFlat = async (req: Request, res: Response) => {
  console.log("hello this is form register flat req.body", req.body)
  const landlord = req.landlord;
  console.log("llndlord ##########################",landlord)
  if (!landlord) throw new NotAuthorizedError();
  const formdata = req.body as RegisterFlatInput;

  const [flatError, flat] = await catchError(
    db.query.flats.findFirst({
      where: and(
        eq(flats.name, formdata.name),
        eq(flats.landlordId, landlord.id), // Check against the logged-in landlord's ID
      ),
    }),
  );
  if (flatError) throw new Error("DB error!");
  if (flat) {
    throw new Error("this flat already exist");
  } else {
    const [flatError, flat] = await catchError(
      db.insert(flats).values({
        ...formdata,
        landlordId: landlord.id.toString(),
      }),
    );
  }
  if (flat) {
    return res.json({
      message: "Account created successfully",
    });
  }

  throw new Error("Db error registerring flat");
};
