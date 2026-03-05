import { Premium, Standard } from "@/constant";
import { db } from "@/db";
import { landlords, subscriptions } from "@/schemas";
import type { SubscriptionInput } from "@/validations/subscription.validation";
import { catchError, NotAuthorizedError } from "@fvoid/shared-lib";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";

export const subscribe = async (req: Request, res: Response) => {
  const landlord = req.landlord;
  if (!landlord) throw new NotAuthorizedError();

  // get the data
  const { plan, durationMonths } = req.body as SubscriptionInput;

  await handleSubscriptionPurchase(landlord.id, plan, durationMonths);

  return res.json({ msg: "purchased successfully" });
};

export const handleSubscriptionPurchase = async (landlordId: string, plan: "standard" | "premium", durationMonths: 1 | 6 | 12 | 24) => {
  return await db.transaction(async (tx) => {
    // 1. Get the landlord
    const landlord = await tx.query.landlords.findFirst({
      where: eq(landlords.id, landlordId),
    });

    if (!landlord) throw new Error("Landlord not found");

    // 2. Define Pricing Logic
    const pricing = {
      standard: 500,
      premium: 1500,
    };

    const discounts = {
      1: 0,
      6: 0.2, // 20% off
      12: 0.3, // 30% off
      24: 0.35, // Example: 35% for 2 years
    };

    // 3. Calculate Cost (For your payment gateway/invoice)
    const basePrice = pricing[plan] * durationMonths;
    // const finalPrice = basePrice * (1 - discounts[durationMonths]);
    const finalPrice = basePrice;

    // =====

    // // 4. Calculate New Expiry Date
    // const now = new Date();
    // let startDate = now;
    // let newExpiry: Date;

    // if (landlord.subscriptionExpiresAt && landlord.subscriptionExpiresAt > now) {
    //   // If still active, start the new period from the current expiry date
    //   startDate = new Date(landlord.subscriptionExpiresAt);
    //   newExpiry = new Date(landlord.subscriptionExpiresAt);
    //   // newExpiry.setMonth(newExpiry.getMonth() + durationMonths);
    //   newExpiry.setMinutes(newExpiry.getMinutes() + durationMonths);
    // } else {
    //   // If expired or new, start from now
    //   newExpiry = new Date();
    //   // newExpiry.setMonth(newExpiry.getMonth() + durationMonths);
    //   newExpiry.setMinutes(newExpiry.getMinutes() + durationMonths);
    // }

    // ====

    const now = new Date();
    let startDate = now;
    let newExpiry: Date;

    // Convert duration (3) into milliseconds: 3 * 60 * 1000
    const addedTimeMs = durationMonths * 60 * 1000;

    if (landlord.subscriptionExpiresAt && landlord.subscriptionExpiresAt > now) {
      // If still active, extend from current expiry
      startDate = new Date(landlord.subscriptionExpiresAt);
      newExpiry = new Date(startDate.getTime() + addedTimeMs);
    } else {
      // If expired or new, start from exactly right now
      startDate = now;
      newExpiry = new Date(now.getTime() + addedTimeMs);
    }

    // ===

    // 5. Update Database
    await tx
      .update(landlords)
      .set({
        plan: plan,
        status: "active", // Unlock the account
        quotaLimit: plan === "standard" ? 10 : 999999, // 999k for premium
        subscriptionExpiresAt: newExpiry,
      })
      .where(eq(landlords.id, landlordId));

    // 4. Record Transaction History
    await tx.insert(subscriptions).values({
      landlordId: landlordId,
      planName: plan,
      durationMonths: durationMonths,
      amountPaid: finalPrice,
      transactionId: crypto.randomUUID(),
      startDate: startDate,
      endDate: newExpiry,
    });

    return { finalPrice, newExpiry };
  });
};
