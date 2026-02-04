import { db } from "@/db";
import { tenants } from "@/schemas";
import type { RegisterTenantInput } from "@/validations/tenant.validation";
import { catchError } from "@fvoid/shared-lib";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";

export const registerTenant = async (req: Request, res: Response) => {
  const formData = req.body as RegisterTenantInput;

  const [tenantError, tenant] = await catchError(
    db.query.landlords.findFirst({
      where: eq(tenants.email, formData.email),
    }),
  );
  if (tenantError) throw new Error("DB error!");
  if (tenant) throw new Error("user exist with this email!");
  else {
    const [tenantError, tenant] = await catchError(
      db.insert(tenants).values(formData),
    );
    if (tenantError) throw new Error("error inserting tenant!");
    return res.json({
      message: "tenant created successfully",
      tenant: tenant,
    });
  }

  return;
};
