import { getJobs } from "@/features/flat/api/query.api";
import { useQuery } from "@tanstack/react-query";

export const useJobQuery = () => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: () => getJobs(),
  });
};
