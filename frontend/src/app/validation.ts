import * as z from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  hasVariant: z.boolean().default(false),
  attributes: z.array(
    z.object({
      name: z.string().min(1, "Attribute name required (e.g. Color)"),
      isSwatch: z.boolean().default(false),
      options: z.array(
        z.object({
          value: z.string().min(1, "Value required (e.g. Red)"),
        })
      ).min(1, "Add at least one option"),
    })
  ).optional(),
}).refine((data) => {
  if (data.hasVariant && (!data.attributes || data.attributes.length === 0)) {
    return false;
  }
  return true;
}, {
  message: "At least one attribute is required when variants are enabled",
  path: ["attributes"],
});

export type ProductFormValues = z.infer<typeof productSchema>;