import { flat__axios } from "@/axios.service";
import { Flat} from "@/features/flat/schemas/flat.schema";

export interface FlatsResponse {
  flats: Flat[];
}
export const getFlats = async () => {
  console.log("from getflats api");
  const response = await flat__axios.get<FlatsResponse>(`/flats`);
  return response.data;
};
