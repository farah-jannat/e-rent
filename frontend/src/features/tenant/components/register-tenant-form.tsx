"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFlatsQuery } from "@/features/flat/queries/use-flats.query";
import useTenantRegisterMutation from "@/features/tenant/mutations/use-tenant-register.mutation";
import {
  registerTenantSchema,
  RegisterTenantSchemaType,
} from "@/features/tenant/schemas/register-tenant.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, Resolver, useForm } from "react-hook-form";

const TenantRegisterForm = () => {
  //---*Queries *---
  const { data, isPending, error } = useFlatsQuery();

  // --- * Mutaiton * ---
  const { mutate: registerTenant } = useTenantRegisterMutation();

  console.log("dataform teant, getting flats", data?.flats);
  // --- *initialize form* ---
  const form = useForm<RegisterTenantSchemaType>({
    resolver: zodResolver(
      registerTenantSchema,
    ) as Resolver<RegisterTenantSchemaType>,
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      flatId: "",
    },
  });

  return (
    <div>
      <form
        id="form-rhf-demo"
        onSubmit={form.handleSubmit((data) => registerTenant(data))}
      >
        {/* <form
        id="form-rhf-demo"
        onSubmit={form.handleSubmit(
          (data) => console.log("... data is ", data),
          (errors) => console.log("Validation Errors:", errors),
        )}
      > */}
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-title">Name</FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-demo-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="tenant name"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-title">Number</FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-demo-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="+880 123456789"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-title">Email</FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-demo-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="tenant@gmail.com"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="flatId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-complex-billingPeriod">
                  flatName
                </FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={(value) => {
                    if (value === "CLEAR_SELECTION") {
                      field.onChange(undefined);
                    } else {
                      field.onChange(value);
                    }
                  }}
                >
                  <SelectTrigger
                    id="form-rhf-complex-billingPeriod"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {data &&
                      data.flats.map((flat) => (
                        <div key={flat.id}>
                          <SelectItem value={flat.id}>{flat?.name}</SelectItem>
                        </div>
                      ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <Button
          type="submit"
          className="px-[12px] py-[4px] bg-purple-900 rounded-[8px] mt-[16px] cursor-pointer"
        >
          Register Tenant
        </Button>
      </form>
    </div>
  );
};

export default TenantRegisterForm;
