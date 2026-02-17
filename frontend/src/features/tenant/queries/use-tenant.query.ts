import { getTenant, getTenants } from "@/features/tenant/api/queries.api";
import { useQuery } from "@tanstack/react-query";

export const useTenantQuery = (id:string) => {
  return useQuery({
    queryKey: ["tenant", id],
    queryFn: () => getTenant(id),
  });
};