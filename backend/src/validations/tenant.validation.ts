import { z } from "zod";

export const registerTenantSchema = z.object({
  //   id: z
  //     .string()
  //     .uuid()
  //     .describe("Unique identifier for the job, auto-generated UUID."),
  name: z.string().min(1, "fullname is required"),
  email:z.string(),
  phone: z.string(),
  flatId: z.string(),
  landlordId: z.string(),
});

export type RegisterTenantInput = z.infer<typeof registerTenantSchema>;
