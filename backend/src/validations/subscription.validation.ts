import { z } from "zod";

export const planEnumSchema = z.enum(["free", "standard", "premium"]);


export const subscriptionSchema = z.object({
  plan: planEnumSchema.default("free"),
});

export type SubscriptionInput = z.infer<typeof subscriptionSchema>;
