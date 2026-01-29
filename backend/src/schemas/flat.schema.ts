import { landlords } from "@/schemas/landlord.schema";
import { pgTable, boolean, numeric, uuid, text } from "drizzle-orm/pg-core";

export const flats = pgTable("flats", {
  id: uuid("id").defaultRandom().primaryKey(),
  landlordId: uuid("landlord_id").references(() => landlords.id),
  name: text("name").notNull(), // e.g., "Flat 4A"
  baseRent: numeric("base_rent", { precision: 10, scale: 2 }).notNull(),
  serviceCharge: numeric("service_charge", { precision: 10, scale: 2 }).default("0"),
  isOccupied: boolean("is_occupied").default(false),
});