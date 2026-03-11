import type { SqlDB } from "@/db";
import type { ITenantService } from "@/interfaces";
import { tenants } from "@/schemas";
import type { RegisterTenantInput, UpdateTenantInput } from "@/validations/tenant.validation";
import { catchError } from "@fvoid/shared-lib";
import { and, eq, or } from "drizzle-orm";

export class TenantService implements ITenantService {
  constructor(public db: SqlDB) {}

  async create(formData: RegisterTenantInput, landlordId: string) {
    const [findError, existingTenant] = await catchError(
      this.db.query.tenants.findFirst({
        where: and(eq(tenants.landlordId, landlordId), or(eq(tenants.email, formData.email), eq(tenants.flatId, formData.flatId))),
      }),
    );

    if (findError) throw new Error("DB error!");
    if (existingTenant) throw new Error("user exist with this email or !");

    const [insertError, tenant] = await catchError(
      this.db
        .insert(tenants)
        .values(formData)
        .returning()
        .then((res) => res[0]),
    );
    if (insertError) throw new Error("Error inserting tenant!");
    return tenant;
  }

  async findAllArchived(landlordId: string) {
    const [TenantError, archivedTenants] = await catchError(
      this.db
        .select()
        .from(tenants)
        .where(and(eq(tenants.landlordId, landlordId), eq(tenants.isArchived, true))),
    );

    if (TenantError) throw new Error("error getting tenants in db", TenantError);

    return archivedTenants;
  }

  async findAll(landlordId: string) {
    const [TenantError, allTenants] = await catchError(
      this.db
        .select()
        .from(tenants)
        .where(and(eq(tenants.landlordId, landlordId), eq(tenants.isArchived, false))),
    );

    if (TenantError) throw new Error("error getting tenants in db", TenantError);

    return allTenants;
  }

  async findById(id: string, landlordId: string) {
    const [tenantError, tenant] = await catchError(
      this.db.query.tenants.findFirst({
        where: and(eq(tenants?.id, id), eq(tenants.landlordId, landlordId)),
      }),
    );
    if (tenantError) throw new Error("DB error!");

    return tenant;
  }

  async update(id: string, formData: UpdateTenantInput) {
    const [tenantError, oldTenant] = await catchError(
      this.db.query.tenants.findFirst({
        where: and(eq(tenants.id, id), eq(tenants.landlordId, formData.landlordId)),
      }),
    );

    if (tenantError) throw new Error("Db error!");
    if (!oldTenant) throw new Error("Tenant not found");

    const [errTenantUpdate, tenant] = await catchError(
      this.db
        .update(tenants)
        .set(formData)
        .where(eq(tenants.id, id))
        .returning()
        .then((res) => res[0]),
    );
    if (errTenantUpdate) throw new Error("Error updating tenant");
    return tenant;
  }

  async remove(id: string, landlordId: string) {
    const [tenantError, tenant] = await catchError(
      this.db
        .delete(tenants)
        .where(and(eq(tenants.id, id), eq(tenants.landlordId, landlordId)))
        .returning()
        .then((res) => res[0]),
    );

    if (tenantError) throw new Error("db error !", tenantError);
    if (!tenant) throw new Error("error deleteing tenant");

    return tenant;
  }

  async archive(id: string, landlordId: string) {
    const [errRestoreTenant, tenant] = await catchError(
      this.db
        .update(tenants)
        .set({ isArchived: true })
        .where(and(eq(tenants.id, id), eq(tenants.landlordId, landlordId)))
        .returning()
        .then((res) => res[0]),
    );
    if (errRestoreTenant) throw new Error("Error archiving tenant");

    return tenant;
  }

  async unArchive(id: string, landlordId: string) {
    const [errRestoreTenant, tenant] = await catchError(
      this.db
        .update(tenants)
        .set({ isArchived: false })
        .where(and(eq(tenants.id, id), eq(tenants.landlordId, landlordId)))
        .returning()
        .then((res) => res[0]),
    );
    if (errRestoreTenant) throw new Error("Error unarchiving tenant");

    return tenant;
  }
}
