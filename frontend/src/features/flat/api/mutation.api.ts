import { flat__axios } from "@/axios.service";
import { Flat } from "@/features/flat/schemas/flat.schema";
import { RegisterFlatSchemaType } from "@/features/flat/schemas/register-flat.schema";
import { Register } from "@tanstack/react-query";

export const registerFlat = async (data: RegisterFlatSchemaType) => {
  console.log("data from register flat api", data);
  const response = await flat__axios.post<Register>(`/register`, data);
  return response.data;
};

export const deleteFlat = async (id: string) => {
  console.log("id to delete", id);
  const response = await flat__axios.delete<Flat>(`/${id}`);
  return response.data;
};
