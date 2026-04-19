import { z } from "zod";

export const registerLandlordSchema = z.object({
  id: z.string().describe("Unique identifier for the job, auto-generated UUID."),
  email: z.string().min(1, "Email is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  password: z.string().min(1, "Password is required"),
  name: z.string().min(1, "fullname is required"),
});

export type RegisterLandlordInput = z.infer<typeof registerLandlordSchema>;

export const loginLandlordSchema = z.object({
  // id: z
  //   .string()
  //   .uuid()
  //   .describe("Unique identifier for the job, auto-generated UUID."),
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginLandlordInput = z.infer<typeof loginLandlordSchema>;

export const updateLandlordPlanSchema = z.object({
  // Plan: Matching your planEnum
  // plan: z.enum(["free", "standard", "premium"]).optional(),
  plan: z.enum(["standard", "premium"]).optional(),

  // Quota: Must be a positive integer
  quotaLimit: z.number().int().positive("Quota limit must be a positive number").optional(),

  // Expiry: Coerces strings (like from a JSON body) into Date objects
  subscriptionExpiresAt: z.date().nullable().optional(),

  // Status: Matching your landlordStatusEnum
  status: z.enum(["active", "suspended", "expired"]).optional(),
});

export type UpdateLandlordPlanInput = z.infer<typeof updateLandlordPlanSchema>;
