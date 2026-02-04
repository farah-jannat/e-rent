import { flat__axios, tenant__axios } from "@/axios.service";
import { RegisterTenantSchemaType } from "@/features/tenant/schemas/register-tenant.schema";

export const registerTenant = async (data: RegisterTenantSchemaType) => {
  console.log("data from register tenant api", data);
  const response = await tenant__axios.post(`/register`, data);
  return response.data;
};
