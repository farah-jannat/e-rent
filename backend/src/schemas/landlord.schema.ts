import { flats } from "@/schemas/flat.schema";
import { rentPayment } from "@/schemas/rentPayment.shcema";
import { tenants } from "@/schemas/tenant.schema";
import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, text } from "drizzle-orm/pg-core";

// --- * landlord Table *-------

export const landlords = pgTable("landlords", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  phoneNumber: text("phone_number"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const landlordRelations = relations(landlords, ({ many }) => ({
  flats: many(flats),
  tenants: many(tenants),
  payments: many(rentPayment),
}));
