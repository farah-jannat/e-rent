import { db } from "@/db";
import { landlords } from "@/schemas";
import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";

export const verifySubscription = async (req: Request, res: Response, next: NextFunction) => {
  const landlordId = req.landlord?.id;

  if (!landlordId) throw new Error("Unautorized");

  const landlord = await db.query.landlords.findFirst({
    where: eq(landlords.id, landlordId),
  });

  if (!landlord) throw new Error("Unautorized");

  // 1. Check Hard Status (Suspended/Expired)
  if (landlord.status === "suspended") {
    return res.status(403).json({ message: "Your account is suspended. Contact support." });
  }

  // 2. Check Logical Lock (Expired & Over Limit)
  //   const [flatCountResult] = await db
  //     .select({ count: sql<number>`count(*)` })
  //     .from(flats)
  //     .where(eq(flats.landlordId, landlordId));

  //   const currentCount = Number(flatCountResult.count);
  //   const isOverLimit = currentCount > landlord.quotaLimit;

  // If status is 'expired' AND they have more than 2 flats, they are LOCKED
  if (landlord.status === "expired") {
    // const restrictedMethods = ["POST", "PUT", "DELETE", "PATCH"];
    // if (restrictedMethods.includes(req.method)) {
    return res.status(403).json({
      code: "SUBSCRIPTION_LOCKED",
      message: "Plan expired. Please pay to manage your properties.",
    });
    // }
  }

  next();
};
