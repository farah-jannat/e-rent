import { z } from "zod";


export const registerLandlordSchema = z.object({
  email: z.string().min(1, "Email is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  password: z.string().min(1, "Password is required"),
  name: z.string().min(1, "fullname is required"),
});

export type RegisterLandlordInput = z.infer<typeof registerLandlordSchema>;