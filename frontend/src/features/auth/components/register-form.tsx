"use client";
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
import useRegisterLandlordMutation from "@/features/auth/mutations/use-register.mutation";
import { register } from "@/features/auth/api/mutations.api";
import { Button } from "@/components/ui/button";

const RegisterForm = () => {
  // --- * Mutaiton * ---
  const { mutate: register, isPending } = useRegisterLandlordMutation();

  // --- *initialize form* ---
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
      <form
        id="form-rhf-demo"
        onSubmit={form.handleSubmit((data) => register(data))}
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
                <FieldLabel htmlFor="form-rhf-demo-title">Your name</FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-demo-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="Your name"
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
                  placeholder="Your email"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="phoneNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-title">
                  PhoneNumber
                </FieldLabel>
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
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-title">Password</FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-demo-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="Password"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        {/* <button
          type="submit"
          className="px-[12px] py-[4px] bg-purple-900 rounded-[8px] mt-[16px] cursor-pointer"
        >
          submit
        </button> */}

        <Button
          type="submit"
          className="px-[12px] py-[4px] bg-purple-900 rounded-[8px] mt-[16px] cursor-pointer"
        >
          Register
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
