import { register } from "@/features/auth/api/mutations.api";
import { RegisterSchemaType } from "@/features/auth/schemas/register.schema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const useRegisterLandlordMutation = () => {
  return useMutation({
    mutationFn: (data: RegisterSchemaType) => register(data),
    onSuccess() {
      toast.success("registered you succesfully! welcomeeeee!");
    },
  });
};
export default useRegisterLandlordMutation;
