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
        combinationKey: z.string(), // e.g., "Red-XL"
        price: z.coerce.number().min(0),
        stock: z.coerce.number().min(0),
        sku: z.string().min(1),
        // We don't store images here per your schema;
        // they are linked to productOptionId or productId
      }),
    )
    .default([]),
});


export type ProductFormValues = z.infer<typeof productSchema>;