"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { productSchema, ProductFormValues } from "./validation";

export function ProductForm() {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      hasVariant: false,
      attributes: [],
    },
  });

  const {
    fields: attrFields,
    append: appendAttr,
    remove: removeAttr,
  } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  const hasVariant = form.watch("hasVariant");

  function onSubmit(values: ProductFormValues) {
    console.log("Submit Data:", values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl border p-6 rounded-lg">
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="iPhone 15 Pro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasVariant"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      if (checked && attrFields.length === 0) appendAttr({ name: "", isSwatch: false, options: [{ value: "" }] });
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>This product has variants</FormLabel>
                  <FormDescription>Check this if the product has multiple sizes, colors, etc.</FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        {hasVariant && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Attributes & Options</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendAttr({ name: "", isSwatch: false, options: [{ value: "" }] })}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Attribute
              </Button>
            </div>

            {attrFields.map((field, index) => (
              <AttributeSection key={field.id} index={index} form={form} onRemove={() => removeAttr(index)} />
            ))}
          </div>
        )}

        <Button type="submit" className="w-full">
          Save Product
        </Button>
      </form>
    </Form>
  );
}

// Sub-component for individual Attributes
function AttributeSection({ index, form, onRemove }: { index: number; form: any; onRemove: () => void }) {
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control: form.control,
    name: `attributes.${index}.options`,
  });

  return (
    <div className="p-4 border rounded-md bg-muted/30 relative">
      <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={onRemove}>
        <Trash2 className="h-4 w-4" />
      </Button>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <FormField
          control={form.control}
          name={`attributes.${index}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attribute Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Color" {...field} />
              </FormControl>
              <FormMessage />
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
                    // Logic to ensure only ONE attribute is a swatch
                    if (checked) {
                      const allAttributes = form.getValues("attributes");
                      allAttributes.forEach((_: any, i: number) => {
                        if (i !== index) form.setValue(`attributes.${i}.isSwatch`, false);
                      });
                    }
                    field.onChange(checked);
                  }}
                />
              </FormControl>
              <FormLabel className="cursor-pointer">Use as Swatch</FormLabel>
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-3">
        <FormLabel>Options / Values</FormLabel>
        <div className="flex flex-wrap gap-2">
          {optionFields.map((opt, optIndex) => (
            <div key={opt.id} className="flex items-center gap-1">
              <FormField
                control={form.control}
                name={`attributes.${index}.options.${optIndex}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input className="w-32 h-8" placeholder="Red" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeOption(optIndex)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="secondary" size="sm" className="h-8" onClick={() => appendOption({ value: "" })}>
            + Add Value
          </Button>
        </div>
      </div>
    </div>
  );
}
