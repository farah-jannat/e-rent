import { subscription__axios } from "@/axios.service";

export const subscribe = async (planType: string) => {
  console.log("data from edit tenant api", planType);
  const response = await subscription__axios.post(`/`, { plan: planType });

  console.log("data of subscripton", response.data);
  return response.data;
};
