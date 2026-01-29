import { landlords } from "@/schemas/landlord.schema";
import { boolean, pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export const subscriptionPlanEnum = pgEnum("plan_type", ["FREE", "PRO", "PREMIUM"]);

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  landlordId: uuid("landlord_id").references(() => landlords.id),
  plan: subscriptionPlanEnum("plan").default("FREE"),
  startDate: timestamp("start_date").defaultNow(),
  expiryDate: timestamp("expiry_date"),
  isActive: boolean("is_active").default(true),
});