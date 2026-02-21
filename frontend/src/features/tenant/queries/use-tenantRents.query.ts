
import { getTenantRents, getTenants } from "@/features/tenant/api/queries.api";
import { useQuery } from "@tanstack/react-query";

export const useTenantRentsQuery = (id:string) => {
  // console.log("44444444444444444inside usetenatrest", id)
  return useQuery({
    queryKey: ["tenant-rents", id],
    queryFn: () => getTenantRents(id),
  });
};