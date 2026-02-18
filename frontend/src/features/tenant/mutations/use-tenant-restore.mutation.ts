import { restoreTenant } from "@/features/tenant/api/mutation.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useTenantRestoreMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (id: string) => restoreTenant(id),
    onSuccess() {
      toast.success(`succesfully restored your tenant`);
      //   router.push(`/tenants`);

      queryClient.invalidateQueries({
        queryKey: ["archived-tenants"],
      });
    },

    onError() {
      toast.error("Error Editing tenant :( !");
    },
  });
};

export default useTenantRestoreMutation;
