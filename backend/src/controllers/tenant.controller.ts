import { db } from "@/db";
import { tenants } from "@/schemas";
import type {
  RegisterTenantInput,
  TenantInput,
} from "@/validations/tenant.validation";
import { catchError, NotAuthorizedError } from "@fvoid/shared-lib";
import { and, eq, or } from "drizzle-orm";
import type { Request, Response } from "express";

export const registerTenant = async (req: Request, res: Response) => {
  const landlord = req.landlord;

  console.log("$$$$$$$$$4landlord", landlord);
  if (!landlord) throw new NotAuthorizedError();
  const formData = req.body as RegisterTenantInput;

  console.log("formdata", formData);
  const [tenantError, tenant] = await catchError(
    db.query.tenants.findFirst({
      where: and(
        eq(tenants.landlordId, landlord.id),
        or(
          eq(tenants.email, formData.email),
          eq(tenants.flatId, formData.flatId),
        ),
      ),
    }),
  );
  if (tenantError) throw new Error("DB error!");
  if (tenant) throw new Error("user exist with this email or !");
  else {
    const [tenantError, tenant] = await catchError(
      db.insert(tenants).values({
        ...formData,
        landlordId: landlord.id.toString(),
      }),
    );
    if (tenantError) throw new Error("error inserting tenant!");
    if (!tenant) throw new Error("error inserting tenant");
    return res.json({
      message: "tenant created successfully",
      tenant: tenant,
    });
  }

  return;
};

export const getTenants = async (req: Request, res: Response) => {
  const landlord = req.landlord;
  console.log("from the getTenants", landlord);

  if (!landlord) throw new NotAuthorizedError();

  const [TenantError, allTenants] = await catchError(
    db
      .select()
      .from(tenants)
      .where(
        and(eq(tenants.landlordId, landlord.id), eq(tenants.isArchived, false)),
      ),
  );

  if (TenantError) throw new Error("error getting tenants in db", TenantError);
  if (!allTenants) throw new Error("tenants are not available");

  return res.json({
    tenants: allTenants,
  });
};

export const getTenant = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  console.log("tenant-id***********8", id);
  if (!id) {
    throw new Error("No tenant Id provided");
  }
  const [tenantError, tenant] = await catchError(
    db.query.tenants.findFirst({
      where: eq(tenants?.id, id),
    }),
  );

  if (tenantError) throw new Error("DB error!");
  if (!tenant) {
    throw new Error("tenant not found with this id! -_-");
  }

  return res.json(tenant);
};

export const updateTenant = async (req: Request, res: Response) => {
  const formData = req.body as TenantInput;
  const [tenantError, oldTenant] = await catchError(
    db.query.tenants.findFirst({
      where: and(
        eq(tenants.id, formData.id),
        eq(tenants.landlordId, formData.landlordId),
      ),
    }),
  );
  if (tenantError) throw new Error("Db errro!");
  const [errTenantUpdate, tenant] = await catchError(
    db
      .update(tenants)
      .set(formData)
      .where(eq(tenants.id, formData.id))
      .returning(),
  );
  if (errTenantUpdate)
    console.log(
      "######################3 Db error updating jobs " + errTenantUpdate,
    );
  return res.json(tenant);
};

export const archiveTenant = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  console.log("arhive tenant id $$$$$$$$$$$$4", id);

  const [tenantError, oldTenant] = await catchError(
    db.query.tenants.findFirst({
      where: eq(tenants.id, id),
    }),
  );
  if (tenantError) throw new Error("db Error");
  if (!oldTenant) throw new Error("tenant is not found with this id");

  const [errArchiveTenant, tenant] = await catchError(
    db
      .update(tenants)
      .set({ isArchived: true })
      .where(eq(tenants.id, id))
      .returning(),
  );

  if (errArchiveTenant)
    console.log(
      "######################3 Db error updating jobs " + errArchiveTenant,
    );
  return res.json(tenant);
};
