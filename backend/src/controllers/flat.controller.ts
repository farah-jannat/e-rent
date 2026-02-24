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

  // check quota

  const [quotaError, quota] = await catchError(
    db.query.quotas.findFirst({
      where: eq(quotas.landlordId, landlord.id),
    }),
  );

  if (quotaError) throw new Error("DB error!");
  // if (!quota) throw new Error("no quota found! :(");

  if (quota && quota.count >= newLandlord.quotaLimit) {
    throw new Error(
      "Monthly quota reached. Please upgrade your plan for more events",
    );
  }

  // const [erreditQuota, updatedQuota] = await catchError(
  //   db
  //     .update(quotas)
  //     .set({ count:count+1})
  //     .where(eq(quotas.id, quotas.id))
  //     .returning(),
  // );

  const [flatError, flat] = await catchError(
    db.query.flats.findFirst({
      where: and(
        eq(flats.name, formdata.name),
        eq(flats.landlordId, landlord.id), // Check against the logged-in landlord's ID
      ),
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
  const [newQuotaError, newQuota] = await catchError(
    db
      .insert(quotas)
      .values({
        landlordId: landlord.id,
        count: 1, // Start at 1 for new records
      })
      .onConflictDoUpdate({
        target: quotas.landlordId,
        set: {
          count: sql`${quotas.count} + 1`,
        },
      })
      .returning(),
  );

  if (newQuotaError) throw new Error("DB error!");
  if (!newQuota) throw new Error("somethis went wrong");

  return res.json({
    message: "Account created successfully",
  });
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
