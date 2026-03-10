import { landlords } from "@/schemas/landlord.schema";
import type { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  boolean,
  numeric,
  uuid,
  text,
  integer,
} from "drizzle-orm/pg-core";

export const flats = pgTable("flats", {
  id: uuid("id").defaultRandom().primaryKey(),
  landlordId: uuid("landlord_id").references(() => landlords.id),
  name: text("name").notNull(), // e.g., "Flat 4A"
  // baseRent: numeric("base_rent", { precision: 10, scale: 2 }),
  baseRent: integer("base_rent"),
  serviceCharge: integer("service_charge"),
  isOccupied: boolean("is_occupied").default(false),
});

export type Flat = InferSelectModel<typeof flats>;