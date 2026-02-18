"use client";
import { deleteTenant } from "@/features/tenant/api/mutation.api";
import useTenantDeleteMutation from "@/features/tenant/mutations/use-tenant-delete.mutation";
import { useArchivedTenantQuery } from "@/features/tenant/queries/use-archivedTenants.query";
import { DeleteIcon, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const Archive = () => {
  const router = useRouter();

  // * --- Query ---- *
  const { data: archivedTenants, isPending, error } = useArchivedTenantQuery();
  console.log("data form arvix", archivedTenants);

  // * --- mutaion --- *
  const { mutate: deleteTenant } = useTenantDeleteMutation();

  return (
    <div>
      Archived tenants
      {archivedTenants?.tenants?.map((tenant) => (
        <div className="" key={tenant.id}>
          <p> {tenant?.name}</p>
          <p>{tenant?.email}</p>
          <p>{tenant?.phone}</p>
          {/* <p>{tenant?.flatId}</p> */}
          <div onClick={() => router.push(`/tenants/edit/${tenant?.id}`)}>
            <Edit2 />
          </div>

          <div onClick={() => deleteTenant(tenant?.id)}>
            <DeleteIcon />
          </div>
          <div>Restore</div>
        </div>
      ))}
    </div>
  );
};

export default Archive;
