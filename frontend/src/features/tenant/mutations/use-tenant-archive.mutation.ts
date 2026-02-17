import { archiveTenant } from "@/features/tenant/api/mutation.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useTenantArchiveMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (id: string) => archiveTenant(id),
    onSuccess() {
      toast.success(`succesfully archived your tenant`);
      router.push(`/tenants`);

      queryClient.invalidateQueries({
        queryKey: ["tenants"],
      });
    },

    onError() {
      toast.error("Error Editing tenant :( !");
    },
  });
};

export default useTenantArchiveMutation;
