import cron from "node-cron";
// import { db } from './db';
// import { tenants, rentPayments, flats } from './schema';
import { and, eq, lt, not } from "drizzle-orm";
import { db } from "@/db";
import { flats, landlords, rentPayment, tenants } from "@/schemas";

// Schedule to run at 00:00 on the 1st day of every month
export const initCronJobs = () => {
  console.log("inside initcronjobs -%%%%%%%*****");
  cron.schedule("0 0 1 * *", async () => {
    // cron.schedule("* * * * *", async () => {
    console.log("Generating monthly rent records...&&&&&&&&&&&&&&&");

    const activeTenants = await db.select().from(tenants).where(eq(tenants.isArchived, false));
    const currentMonth = new Date().toISOString().slice(0, 7); // "2026-02"

    for (const tenant of activeTenants) {
      // 1. Get the rent amount for this tenant's flat
      const flatData = await db.select().from(flats).where(eq(flats.id, tenant.flatId!)).limit(1);
      const rentAmount = flatData[0]?.baseRent || 0;

      // 2. Create the "Unpaid" record
      await db.insert(rentPayment).values({
        tenantId: tenant.id,
        landlordId: tenant.landlordId,
        billingMonth: currentMonth,
        amountDue: rentAmount,
        status: "UNPAID",
      });
    }

    console.log(`Successfully generated bills for ${activeTenants.length} tenants.`);
  });
};

export const initSubscriptionCron = () => {
  cron.schedule("1 0 * * *", async () => {
    const now = new Date();

    // 1. Mark as 'expired' and downgrade plan
    await db
      .update(landlords)
      .set({
        plan: "free",
        status: "expired", // <--- Trigger the lock status here
        quotaLimit: 2,
        subscriptionExpiresAt: null,
      })
      .where(and(not(eq(landlords.plan, "free")), lt(landlords.subscriptionExpiresAt, now)));
  });
};


// Log the transaction
// Create the Middleware
// Instead of adding fields
// The Subscription Logic
// The Purchase Controller
// The bKash Callback
