import { getArchivedTenants } from "@/features/tenant/api/queries.api";
import { useQuery } from "@tanstack/react-query";

export const useArchivedTenantQuery = () => {
  return useQuery({
    queryKey: ["archived-tenants"],
    queryFn: () => getArchivedTenants(),
  });
};
