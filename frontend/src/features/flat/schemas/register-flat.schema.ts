import { z } from "zod";

export const registerFlatSchema = z.object({
  // id: z
  //   .string()
  //   .uuid()
  //   .describe("Unique identifier for the job, auto-generated UUID."),
  // landlordId: z.string(),
  name: z.string().min(1, "fullname is required"),
  //   baseRent:
  //   serviceCharge:
  //   isOccupied:
});

export type RegisterFlatSchemaType = z.infer<typeof registerFlatSchema>;
