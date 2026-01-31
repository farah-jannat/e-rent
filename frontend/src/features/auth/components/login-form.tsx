"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { login } from "@/features/auth/api/mutations.api";
import useLoginMutation from "@/features/auth/mutations/use-login.mutation";
import {
  loginSchema,
  LoginSchemaType,
} from "@/features/auth/schemas/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, Resolver, useForm } from "react-hook-form";

const LoginForm = () => {

  // --- * Mutaiton * ---
  const { mutate: login, isPending } = useLoginMutation();

  // --- *initialize form* ---
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema) as Resolver<LoginSchemaType>,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div>
      <form
        id="form-rhf-demo"
        onSubmit={form.handleSubmit((data) => login(data))}
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

        <Button
          type="submit"
          className="px-[12px] py-[4px] bg-purple-900 rounded-[8px] mt-[16px] cursor-pointer"
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
