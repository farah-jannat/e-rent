"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerFlat } from "@/features/flat/api/mutation.api";
import useFlatRegisterMutation from "@/features/flat/mutations/use-flat-register.mutation";
import {
  registerFlatSchema,
  RegisterFlatSchemaType,
} from "@/features/flat/schemas/register-flat.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, Resolver, useForm } from "react-hook-form";

const FlatRegisterForm = () => {
  // --- * Mutaiton * ---
  const { mutate: registerFlat, isPending } = useFlatRegisterMutation();

  // --- *initialize form* ---
  const form = useForm<RegisterFlatSchemaType>({
    resolver: zodResolver(
      registerFlatSchema,
    ) as Resolver<RegisterFlatSchemaType>,
    defaultValues: {
      name: "",
      baseRent: 0,
    },
  });

  return (
    <div>
      <form
        id="form-rhf-demo"
        onSubmit={form.handleSubmit((data) => registerFlat(data))}
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
                <FieldLabel htmlFor="form-rhf-demo-title">Flat name</FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-demo-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="5-A"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="baseRent"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-title">Flat Rent</FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-demo-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="10000"
                  autoComplete="off"
                />
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
          Register flat
        </Button>
      </form>
    </div>
  );
};

export default FlatRegisterForm;
