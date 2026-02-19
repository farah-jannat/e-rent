import { z } from "zod";

export const registerFlatSchema = z.object({
  // id: z
  //   .string()
  //   .uuid()
  //   .describe("Unique identifier for the job, auto-generated UUID."),
  // name: z.string().min(1, "fullname is required"),
  // landlordId: z.string(),

  id: z
    .string()
    .uuid()
    .describe("Unique identifier for the job, auto-generated UUID."),
  landlordId: z.string(),
  name: z.string().min(1, "fullname is required"),
  baseRent: z.coerce.number().min(1, "Rent must be greater than 0"),
});

export type RegisterFlatInput = z.infer<typeof registerFlatSchema>;
