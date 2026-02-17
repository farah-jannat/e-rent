import { email, z } from "zod";

export const tenantSchema = z.object({
  id: z
    .string()
    .uuid()
    .describe("Unique identifier for the job, auto-generated UUID."),
  name: z.string().min(1, "fullname is required"),
  phone: z.string(),
  email: z.string(),
  landlordId: z.string(),
  flatId: z.string(),
});

export type Tenant = z.infer<typeof tenantSchema>;
