import { tenant__axios } from "@/axios.service";
import { Tenant } from "@/features/tenant/schemas/tenant.schema";

export interface TenantsResponse {
  tenants: Tenant[];
}
export const getTenants = async () => {
  console.log("form gettenants api");
  const response = await tenant__axios.get<TenantsResponse>(`/tenants`);
  console.log("tenats form#########3", response.data);
  return response.data;
};
