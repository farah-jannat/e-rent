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

export const getTenant = async (id: string) => {
  console.log("form gettenant api", id);
  const response = await tenant__axios.get<Tenant>(`/tenants/${id}`);
  console.log("tenat info", response.data);
  return response.data;
};

export const getArchivedTenants = async () => {
  console.log("form arivecd tenants");
  const response = await tenant__axios.get<TenantsResponse>(`/archive`);
  console.log("tenat info", response.data);
  return response.data;
};
