"use client";
import { useTenantsQuery } from "@/features/tenant/queries/use-tenants.query";
import { Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const Tenants = () => {
  const router = useRouter();
  // ---* queries * ---
  const { data, isPending } = useTenantsQuery();
  console.log("data here of tenants", data);

  return (
    <div className="mx-[100px] my-[50px]">
      <p>all tenants datas</p>
      {data &&
        data.tenants?.map((tenant) => (
          <div className="" key={tenant.id}>
            <p> {tenant?.name}</p>
            <p>{tenant?.email}</p>
            <p>{tenant?.phone}</p>
            {/* <p>{tenant?.flatId}</p> */}
            <div onClick={() => router.push(`/tenants/edit/${tenant?.id}`)}>
              <Edit2 />
            </div>
          </div>
        ))}
    </div>
  );
};

export default Tenants;
