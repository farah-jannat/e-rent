import { Free } from "@/constant";
import { flats } from "@/schemas/flat.schema";
import { quotas } from "@/schemas/quota.schema";
import { rentPayment } from "@/schemas/rentPayment.schema";
import { tenants } from "@/schemas/tenant.schema";
import { relations } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  uuid,
  text,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

// --- * landlord Table *-------
export const planEnum = pgEnum("landlord_plans", [
  "free",
  "standard",
  "premium",
]);

export const landlords = pgTable("landlords", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  phoneNumber: text("phone_number"),
  quotaLimit: integer("quota_limit").default(Free.flats).notNull(),
  plan: planEnum("plan").notNull().default("free"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const landlordRelations = relations(landlords, ({ many, one }) => ({
  flats: many(flats),
  tenants: many(tenants),
  payments: many(rentPayment),
  // quota: one(quotas)
}));
