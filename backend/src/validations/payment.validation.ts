import { z } from "zod";

export const insertPaymentSchema = z.object({
  landlordId: z.string(),
  planName: z.string().min(1, "Plan name is required"),
  durationMonths: z.number().int().positive(),
  amountPaid: z.number().int().nonnegative(),
  transactionId: z.string().min(1, "Transaction ID is required"),
  paymentMethod: z.enum(["bkash", "nagad", "sslcommerz", "manual"]).optional(),
  startDate: z.date(),
  endDate: z.date({}),
});

export type InsertPaymentInput = z.infer<typeof insertPaymentSchema>;
