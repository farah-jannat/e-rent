import { landlords } from "@/schemas/landlord.schema";
import { tenants } from "@/schemas/tenant.schema";
import {
  pgTable,
  numeric,
  uuid,
  text,
  timestamp,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";

export const paymentStatusEnum = pgEnum("payment_status", [
  "PAID",
  "PARTIAL",
  "UNPAID",
]);

export const rentPayment = pgTable("rent_payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id),
  landlordId: uuid("landlord_id").references(() => landlords.id),
  billingMonth: text("billing_month").notNull(), // Format: "YYYY-MM" (e.g., "2026-01")
  amountDue: integer("amount_due"),
  amountPaid: integer("amount_paid"),
  status: paymentStatusEnum("status").default("UNPAID"),
  paymentDate: timestamp("payment_date"),
  remarks: text("remarks"), // For extra notes
});
