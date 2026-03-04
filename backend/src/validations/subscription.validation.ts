import { z } from "zod";

export const planEnumSchema = z.enum(["standard", "premium"]);

export const subscriptionSchema = z.object({
  plan: planEnumSchema,
  // duration: z.int,
  // duration: z.coerce.number().min(1, "Duration must be greater than 0"),
  durationMonths: z.union([z.literal(1), z.literal(6), z.literal(12), z.literal(24)]),
});

export type SubscriptionInput = z.infer<typeof subscriptionSchema>;
