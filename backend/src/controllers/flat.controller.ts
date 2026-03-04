import { db } from "@/db";
import { flats, landlords, quotas } from "@/schemas";
import type { RegisterFlatInput } from "@/validations/flat.validation";
import { catchError, handleAsync, NotAuthorizedError } from "@fvoid/shared-lib";
import { and, count, eq, sql } from "drizzle-orm";
import type { Request, Response } from "express";

export const registerFlat = async (req: Request, res: Response) => {
  const landlord = req.landlord;

  if (!landlord) throw new NotAuthorizedError();

  const formdata = req.body as RegisterFlatInput;

  // fetch landlord quota
  const [landlordError, newLandlord] = await catchError(
    db.query.landlords.findFirst({
      where: eq(landlords.id, landlord.id),
    }),
  );

  if (landlordError) throw new Error("DB error!");
  if (!newLandlord) throw new Error("no landlord found! :(");

  const [flatCountError, [flatCountResult]] = await catchError(
    db
      .select({ count: sql<number>`count(*)` })
      .from(flats)
      .where(eq(flats.landlordId, landlord.id)),
  );
  if (flatCountError) throw new Error("DB error!");

  const currentCount = Number(flatCountResult ? flatCountResult.count : 0);

  if (newLandlord.plan !== "premium" && currentCount >= newLandlord.quotaLimit) {
    return res.status(403).json({
      message: `Limit reached for ${newLandlord.plan} plan. You have ${currentCount} flats. Please upgrade.`,
      currentFlats: currentCount,
      limit: newLandlord.quotaLimit,
    });
  }

  const [flatError, flat] = await catchError(
    db.query.flats.findFirst({
      where: and(eq(flats.name, formdata.name), eq(flats.landlordId, landlord.id)),
    }),
  );
  if (flatError) throw new Error("DB error!");
  if (flat) throw new Error("this flat already exist");

  const [newFlatError, newFlat] = await catchError(
    db.insert(flats).values({
      ...formdata,
      landlordId: landlord.id.toString(),
    }),
  );

  if (newFlatError) throw new Error("error inserting flat in db", newFlatError);
  if (!newFlat) throw new Error("error inserting flat in db");

  return res.json({
    message: "Account created successfully",
  });
};

export const getFlats = async (req: Request, res: Response) => {
  const landlord = req.landlord;
  console.log("from the getflats");

  if (!landlord) throw new NotAuthorizedError();

  const [flatError, allFlats] = await catchError(db.select().from(flats).where(eq(flats.landlordId, landlord.id)));

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
  const [flatError, flat] = await catchError(db.delete(flats).where(eq(flats.id, id)));
  if (flatError) throw new Error("error deleting flat!", flatError);
  if (!flat) throw new Error("flat not found");

  return res.json({
    flat: flat,
  });
};
