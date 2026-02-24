import { Premium, Standard } from "@/constant";
import { db } from "@/db";
import { landlords } from "@/schemas";
import type { SubscriptionInput } from "@/validations/subscription.validation";
import { catchError, NotAuthorizedError } from "@fvoid/shared-lib";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";

export const subscribe = async (req: Request, res: Response) => {
  const landlord = req.landlord;

  if (!landlord) throw new NotAuthorizedError();
  const data = req.body as SubscriptionInput;
  console.log("from the subscription ^^^^^^^^^^^6", data);

  const [landlordError, newLandlord] = await catchError(
    db.query.landlords.findFirst({
      where: eq(landlords.id, landlord.id),
    }),
  );

  if (landlordError) throw new Error("DB error!");
  if (!newLandlord) throw new Error("no landlord found! :(");

  if (newLandlord.plan == data.plan)
    throw new Error("you are already using this plan");

  // prepare quota limit

  let newQuotaLimit = newLandlord.quotaLimit;
  if (data.plan == "standard") {
    newQuotaLimit = newQuotaLimit + Standard.flats;
  }

  if (data.plan == "premium") {
    newQuotaLimit = newQuotaLimit + Premium.flats;
  }

  const [errUpdatePlan, updatedLandlord] = await catchError(
    db
      .update(landlords)
      .set({ plan: data.plan, quotaLimit: newQuotaLimit })
      .where(eq(landlords.id, landlord.id))
      .returning(),
  );
  if (errUpdatePlan)
    console.log(
      "######################3 Db error updating jobs " + errUpdatePlan,
    );

  //   if (!landlord) throw new NotAuthorizedError();

  //   const [flatError, allFlats] = await catchError(
  //     db.select().from(flats).where(eq(flats.landlordId, landlord.id)),
  //   );

  //   if (flatError) throw new Error("error getting flat in db", flatError);
  //   if (!allFlats) throw new Error("error getting flats");

  return res.json(updatedLandlord);
};
