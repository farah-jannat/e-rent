import { z } from "zod";

export const registerFlatSchema = z.object({
  id: z
    .string()
    .uuid()
    .describe("Unique identifier for the job, auto-generated UUID."),
  name: z.string().min(1, "fullname is required"),
  landlordId: z.string(),
});

export type RegisterFlatInput = z.infer<typeof registerFlatSchema>;
