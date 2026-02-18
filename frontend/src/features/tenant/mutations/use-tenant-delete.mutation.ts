import { deleteTenant } from "@/features/tenant/api/mutation.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useTenantDeleteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTenant(id),
    onSuccess() {
        console.log("inside oncussedd ")
      toast.success(`succesfully deleted tenant `);
      queryClient.invalidateQueries({
        queryKey: ["archived-tenants"],
      });
    },
    onError() {
      toast.error("Error deleting Flat :( !");
    },
  });
};

export default useTenantDeleteMutation;
