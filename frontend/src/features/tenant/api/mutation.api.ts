import { tenant__axios } from "@/axios.service";
import { RegisterTenantSchemaType } from "@/features/tenant/schemas/register-tenant.schema";
import { Tenant } from "@/features/tenant/schemas/tenant.schema";

export const registerTenant = async (data: RegisterTenantSchemaType) => {
  // console.log("data from register tenant api", data);
  const response = await tenant__axios.post(`/register`, data);
  return response.data;
};

export const editTenant = async (data: Tenant) => {
  console.log("data from edit tenant api", data);
  const response = await tenant__axios.put(`/`, data);
  return response.data;
};

export const archiveTenant = async (id: string) => {
  console.log("data from arcive tenant api", id);
  const response = await tenant__axios.put(`/${id}`);
  return response.data;
};

export const deleteTenant = async (id: string) => {
  console.log("id to delete tenant", id);
  const response = await tenant__axios.delete<Tenant>(`/${id}`);
  console.log("response of delete", response.data);
  return response.data;
};

export const restoreTenant = async (id: string) => {
  console.log("id to restore tenant", id);
  const response = await tenant__axios.put<Tenant>(`/archive/${id}`);
  return response.data;
};
