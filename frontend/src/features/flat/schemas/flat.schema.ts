import { z } from "zod";

export const flatSchema = z.object({
  id: z
    .string()
    .uuid()
    .describe("Unique identifier for the job, auto-generated UUID."),
  landlordId: z.string(),
  name: z.string().min(1, "fullname is required"),
  baseRent: z.number(),
  serviceCharge: z.number(),
  isOccupied: z.boolean(),
});

export type Flat = z.infer<typeof flatSchema>;
