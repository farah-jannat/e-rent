import { db } from "@/db";
import { flats } from "@/schemas";
import type { RegisterFlatInput } from "@/validations/flat.validation";
import { catchError, handleAsync, NotAuthorizedError } from "@fvoid/shared-lib";
import { and, count, eq } from "drizzle-orm";
import type { Request, Response } from "express";

export const registerFlat = async (req: Request, res: Response) => {
  const landlord = req.landlord;

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
    if (flatError) throw new Error("error inserting flat in db", flatError);

    if (!flat) throw new Error("error inserting flat in db");

    return res.json({
      message: "Account created successfully",
    });
  }
};

export const getFlats = async (req: Request, res: Response) => {
  const landlord = req.landlord;
  console.log("from the getflats");

  if (!landlord) throw new NotAuthorizedError();

  const [flatError, allFlats] = await catchError(
    db.select().from(flats).where(eq(flats.landlordId, landlord.id)),
  );

  if (flatError) throw new Error("error getting flat in db", flatError);
  if (!allFlats) throw new Error("error getting flats");

  return res.json({
    flats: allFlats,
  });
};

export const deleteFlat = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  console.log("flat-id***********8", id);
  if (!id) {
    throw new Error("No flatId provided");
  }
  const [flatError, flat] = await catchError(
    db.delete(flats).where(eq(flats.id, id)),
  );
  if (flatError) throw new Error("error deleting flat!", flatError);
  if (!flat) throw new Error("flat not found");

  return res.json({
    flat: flat,
  });
};
