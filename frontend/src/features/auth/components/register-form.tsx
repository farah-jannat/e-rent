'use client'
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  registerSchema,
  RegisterSchemaType,
} from "@/features/auth/schemas/register.schema";

import React from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const RegisterForm = () => {
  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema) as Resolver<RegisterSchemaType>,
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
  });

  return (
    <div>
      {/* <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}> */}
      <form id="form-rhf-demo">
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-title">Bug Title</FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-demo-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="Login button not working on mobile"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
    </div>
  );
};

export default RegisterForm;
