import { getTenants } from "@/features/tenant/api/queries.api";
import { useQuery } from "@tanstack/react-query";

export const useTenantsQuery = () => {
  return useQuery({
    queryKey: ["tenants"],
    queryFn: () => getTenants(),
  });
};
