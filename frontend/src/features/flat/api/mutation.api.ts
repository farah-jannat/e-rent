import { flat__axios } from "@/axios.service";
import { RegisterFlatSchemaType } from "@/features/flat/schemas/register-flat.schema";
import { Register } from "@tanstack/react-query";

export const registerFlat = async (data: RegisterFlatSchemaType) => {
  console.log("data from register flat api", data);
  const response = await flat__axios.post<Register>(`/register`, data);
  return response.data;
};
