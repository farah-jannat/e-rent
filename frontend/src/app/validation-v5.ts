// validation.ts
import * as z from "zod";

export const productSchema = z.object({
  name: z.string().min(2),
  hasVariant: z.boolean(),
  // Global images (always visible)
  images: z.array(z.object({ url: z.string() })).default([]),
  attributes: z
    .array(
      z.object({
        name: z.string().min(1),
        isSwatch: z.boolean(),
        options: z.array(
          z.object({
            value: z.string().min(1),
            images: z.array(z.object({ url: z.string() })).default([]), // Ensure this exists
          }),
        ),
      }),
    )
    .optional(),
  variations: z
    .array(
      z.object({
        id: z.string().optional(), // Add this to track existing DB records
        combinationKey: z.string(),
        sku: z.string(),
        price: z.coerce.number(),
        stock: z.coerce.number(),
        isRemoved: z.boolean().default(false),
      }),
    )
    .default([]),
});

export type ProductFormValues = z.infer<typeof productSchema>;
