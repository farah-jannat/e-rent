import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().min(1, "Email is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  password: z.string().min(1, "Password is required"),
  name: z.string().min(1, "fullname is required"),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;

