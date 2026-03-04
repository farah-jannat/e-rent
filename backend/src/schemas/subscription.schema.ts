import { landlords } from "@/schemas/landlord.schema";
import { pgTable, uuid, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const paymentMethodEnum = pgEnum("payment_method", ["bkash", "nagad", "sslcommerz", "manual"]);

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  landlordId: uuid("landlord_id").references(() => landlords.id).notNull(),
  
  // Details of what they bought
  planName: text("plan_name").notNull(), // "standard" | "premium"
  durationMonths: integer("duration_months").notNull(), // 1, 6, 12, 24
  
  // Financial data
  amountPaid: integer("amount_paid").notNull(),
  transactionId: text("transaction_id").unique().notNull(), // From Payment Gateway
  paymentMethod: paymentMethodEnum("payment_method").default("sslcommerz"),
  
  // Period for THIS specific payment
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date").notNull(),
  
  createdAt: timestamp("created_at").defaultNow(),
});