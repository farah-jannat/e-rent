import { deleteFlat } from "@/features/flat/api/mutation.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useFlatDeleteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFlat(id),
    onSuccess() {
      toast.success(`succesfully deleted your flat `);
      queryClient.invalidateQueries({
        queryKey: ["flats"],
      });
    },
    onError() {
      toast.error("Error deleting Flat :( !");
    },
  });
};

export default useFlatDeleteMutation;
