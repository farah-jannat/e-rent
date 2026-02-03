import { getFlats } from "@/features/flat/api/query.api";
import { useQuery } from "@tanstack/react-query";

export const useFlatsQuery = () => {
  return useQuery({
    queryKey: ["flats"],
    queryFn: () => getFlats(),
  });
};
