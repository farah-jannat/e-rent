import { editStatus } from "@/features/tenant/api/mutation.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useTenantEditStatusMutation = (id: string) => {
  const queryClient = useQueryClient();
  //   const router = useRouter();
  return useMutation({
    mutationFn: (id: string) => editStatus(id),
    onSuccess() {
      toast.success(`succesfully edited your tenants status`);
      //   router.push(`/tenants`);

      queryClient.invalidateQueries({
        queryKey: ["tenant-rents", id],
      });
    },

    onError() {
      toast.error("Error Editing tenant :( !");
    },
  });
};

export default useTenantEditStatusMutation;
