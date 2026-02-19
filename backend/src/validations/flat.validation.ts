import { z } from "zod";

export const registerFlatSchema = z.object({
  name: z.string().min(1, "fullname is required"),
  baseRent: z.coerce.number().min(1, "Rent must be greater than 0"),
});

export type RegisterFlatInput = z.infer<typeof registerFlatSchema>;
