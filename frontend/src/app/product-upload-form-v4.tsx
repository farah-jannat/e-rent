"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductFormValues, productSchema } from "./validation-v4";
import { useEffect } from "react";

export function ProductForm() {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", hasVariant: false, attributes: [], images: [], variations: [] },
  });

  const {
    fields: attrFields,
    append: appendAttr,
    remove: removeAttr,
  } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  const {
    fields: variationFields,
    replace: replaceVariations,
    remove: removeVariation,
  } = useFieldArray({
    control: form.control,
    name: "variations",
  });

  const watchedAttributes = useWatch({
    control: form.control,
    name: "attributes",
  });

  const hasVariant = form.watch("hasVariant");
  function generateCartesian(arrays: any[][]) {
    return arrays.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));
  }

  const removedVariants = variationFields.filter((_, idx) => form.watch(`variations.${idx}.isRemoved`));

  // Auto-generate variations when attributes/options change
  useEffect(() => {
    if (!hasVariant || !watchedAttributes || watchedAttributes.length === 0) return;

    // 1. Filter for attributes that actually have names and options
    const validAttributes = watchedAttributes.filter(
      (attr) => attr.name && attr.options?.length > 0 && attr.options.every((opt) => opt.value),
    );

    if (validAttributes.length > 0) {
      const optionsArrays = validAttributes.map((attr) => attr.options.map((opt) => opt.value));

      // 2. Generate combinations
      const combinations = generateCartesian(optionsArrays);

      const newVariations = combinations.map((combo) => {
        // FIX: Ensure combo is an array even if there's only one attribute
        const comboArray = Array.isArray(combo) ? combo : [combo];

        // Sort to ensure "Red_XL" and "XL_Red" are treated as the same key
        const comboKey = [...comboArray].sort().join("_");

        const existing = form.getValues("variations")?.find((v) => v.combinationKey === comboKey);

        return {
          combinationKey: comboKey,
          sku: existing?.sku || "",
          price: existing?.price || 0,
          stock: existing?.stock || 0,
          isRemoved: existing?.isRemoved || false,
        };
      });

      replaceVariations(newVariations);
    }
  }, [watchedAttributes, hasVariant, replaceVariations]);

  return (
    <Form {...form}>
      {/* <form onSubmit={form.handleSubmit(console.log)} className="space-y-8 max-w-4xl border p-6 rounded-lg"> */}
      <form onSubmit={form.handleSubmit((data) => console.log(data))} className="space-y-8 max-w-4xl border p-6 rounded-lg">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* GLOBAL IMAGE UPLOAD (Always Visible) */}
          <div className="space-y-2">
            <FormLabel>Product Images {hasVariant && "(Global / Default)"}</FormLabel>
            <div className="p-8 border-2 border-dashed rounded-md text-center bg-muted/20">
              <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-2">Upload general product gallery images</p>
              {/* Add your Image Uploader Component here linking to "images" field */}
            </div>
          </div>

          <FormField
            control={form.control}
            name="hasVariant"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>This product has variants</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        {hasVariant && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-bold">Variant Configuration</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendAttr({ name: "", isSwatch: false, options: [{ value: "", images: [] }] })}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Attribute
              </Button>
            </div>

            {attrFields.map((field, index) => (
              <AttributeSection key={field.id} index={index} form={form} onRemove={() => removeAttr(index)} />
            ))}
          </div>
        )}

        {hasVariant && variationFields.length > 0 && (
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-bold">Variations Inventory</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-left">Variant</th>
                    <th className="p-2 text-left">SKU</th>
                    <th className="p-2 text-left">Price</th>
                    <th className="p-2 text-left">Stock</th>
                    <th className="p-2 text-left">remove</th>
                  </tr>
                </thead>
                <tbody>
                  {variationFields.map((field, vIndex) => {
                    // We use watch here so the UI reacts immediately to the toggle
                    const isRemoved = form.watch(`variations.${vIndex}.isRemoved`);

                    if (isRemoved) return null; // Don't render the row

                    return (
                      <tr key={field.id} className="border-t">
                        <td className="p-2">{field.combinationKey}</td>

                        <td className="p-2">
                          <Input {...form.register(`variations.${vIndex}.sku`)} placeholder="SKU" className="h-8" />
                        </td>
                        <td className="p-2">
                          <Input type="number" {...form.register(`variations.${vIndex}.price`)} className="h-8 w-24" />
                        </td>
                        <td className="p-2">
                          <Input type="number" {...form.register(`variations.${vIndex}.stock`)} className="h-8 w-20" />
                        </td>
                        {/* ... SKU, Price, Stock inputs ... */}
                        <td className="p-2">
                          <Button type="button" variant="ghost" onClick={() => form.setValue(`variations.${vIndex}.isRemoved`, true)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {removedVariants.length > 0 && (
                <div className="text-sm text-muted-foreground mt-4">
                  <p>Excluded variants: {removedVariants.map((v) => v.combinationKey).join(", ")}</p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => {
                      // Logic to reset isRemoved to false for all
                      variationFields.forEach((_, i) => form.setValue(`variations.${i}.isRemoved`, false));
                    }}
                  >
                    Restore All
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        <Button type="submit" className="w-full">
          Save Product
        </Button>
      </form>
    </Form>
  );
}

function AttributeSection({ index, form, onRemove }: { index: number; form: any; onRemove: () => void }) {
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control: form.control,
    name: `attributes.${index}.options`,
  });

  // useWatch is more reliable for nested array fields
  const isSwatch = useWatch({
    control: form.control,
    name: `attributes.${index}.isSwatch`,
  });

  const attributeName = useWatch({
    control: form.control,
    name: `attributes.${index}.name`,
  });

  return (
    <div className="p-5 border rounded-xl bg-card relative shadow-sm mb-6">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
        onClick={onRemove}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <FormField
          control={form.control}
          name={`attributes.${index}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attribute Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Color" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`attributes.${index}.isSwatch`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-end space-x-3 mb-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      // Logic: Force other attributes to isSwatch: false
                      const attrs = form.getValues("attributes");
                      attrs.forEach((_: any, i: number) => {
                        if (i !== index) form.setValue(`attributes.${i}.isSwatch`, false);
                      });
                    }
                    field.onChange(checked);
                  }}
                />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer text-sm">Enable Swatch Uploads</FormLabel>
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {attributeName || "Attribute"} Values
        </FormLabel>

        <div className="grid gap-4">
          {optionFields.map((opt, optIndex) => (
            <div key={opt.id} className="p-4 border rounded-lg bg-muted/5 space-y-4">
              <div className="flex items-center gap-4">
                <FormField
                  control={form.control}
                  name={`attributes.${index}.options.${optIndex}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="e.g. Royal Blue" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeOption(optIndex)}
                  disabled={optionFields.length === 1}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              {/* IMPORTANT: isSwatch is now derived from useWatch. 
                  This block will re-render immediately when the checkbox is toggled.
              */}
              {isSwatch && (
                <div className="mt-2 p-6 border-2 border-dashed rounded-lg bg-background animate-in zoom-in-95 duration-200">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center text-primary font-semibold text-sm">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Swatch Images: {form.getValues(`attributes.${index}.options.${optIndex}.value`) || "Unnamed Value"}
                    </div>
                    <p className="text-[10px] text-muted-foreground text-center mb-2">Upload images specific to this variant option.</p>

                    {/* The Actual Uploader Path */}
                    <Input
                      type="file"
                      multiple
                      className="max-w-xs h-8 text-[10px]"
                      onChange={(e) => {
                        // Logic to handle image upload for attributes[index].options[optIndex].images
                        console.log("Uploading for:", optIndex);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full border-dashed py-4"
            onClick={() => appendOption({ value: "", images: [] })}
          >
            <Plus className="mr-2 h-3 w-3" /> Add Value
          </Button>
        </div>
      </div>
    </div>
  );
}
