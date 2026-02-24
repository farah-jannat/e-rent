import { landlords } from "@/schemas/landlord.schema";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const quotas = pgTable("quotas", {
  id: uuid("id").defaultRandom().primaryKey(),
  // landlordId: uuid("landlord_id").references(() => landlords.id),
  landlordId: uuid("landlord_id")
    .references(() => landlords.id)
    .unique()
    .notNull(),
  count: integer("count").default(0).notNull(),

  //   name: text("name").notNull(),
  //   email: text("email").unique().notNull(),
  //   password: text("password").notNull(),
  //   phoneNumber: text("phone_number"),
  //   createdAt: timestamp("created_at").defaultNow(),
});
