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


