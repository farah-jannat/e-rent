"use client";
import { editStatus } from "@/features/tenant/api/mutation.api";
import useTenantEditStatusMutation from "@/features/tenant/mutations/use-tenant-editStatus.mutation";
import { useTenantQuery } from "@/features/tenant/queries/use-tenant.query";
import { useTenantRentsQuery } from "@/features/tenant/queries/use-tenantRents.query";
import { useParams } from "next/navigation";
import React from "react";

const Tenant = () => {
  const { id } = useParams<{ id: string }>();

  // --- *query* ---
  const { data: tenant, isPending, error } = useTenantQuery(id);
  const { data: tenantRent } = useTenantRentsQuery(id);

  // --- *mutation* ---
  const { mutate: editStatus } = useTenantEditStatusMutation();
  return (
    <div>
      <p>{tenant?.name}</p>
      <p>{tenant?.email}</p>
      <p>{tenant?.phone}</p>
      <p onClick={() => editStatus(tenantRent?.[0].tenantId)}>
        {tenantRent?.[0].status}
      </p>
    </div>
  );
};

export default Tenant;
