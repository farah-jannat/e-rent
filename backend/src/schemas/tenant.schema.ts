import { flats } from "@/schemas/flat.schema";
import { landlords } from "@/schemas/landlord.schema";
import { pgTable, timestamp, boolean, uuid, text } from "drizzle-orm/pg-core";



// 4. Tenant Model
export const tenants = pgTable("tenants", {
  id: uuid("id").defaultRandom().primaryKey(),
  landlordId: uuid("landlord_id").references(() => landlords.id),
  flatId: uuid("flat_id").references(() => flats.id),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  joiningDate: timestamp("joining_date").defaultNow(),
  isArchived: boolean("is_archived").default(false),
});