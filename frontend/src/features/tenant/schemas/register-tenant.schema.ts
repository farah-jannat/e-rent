import { z } from "zod";

export const registerTenantSchema = z.object({
  // id: z
  //   .string()
  //   .uuid()
  //   .describe("Unique identifier for the job, auto-generated UUID."),
  name: z.string().min(1, "fullname is required"),
  phone: z.string(),
//   landlordId: z.string(),
  flat: z.string(),
});

export type RegisterTenantSchemaType = z.infer<typeof registerTenantSchema>;
