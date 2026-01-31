import { register } from "@/features/auth/api/mutations.api";
import { RegisterSchemaType } from "@/features/auth/schemas/register.schema";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useRegisterLandlordMutation = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: RegisterSchemaType) => register(data),
    onSuccess() {
      toast.success("registered you succesfully! welcomeeeee!");
    },
    onError() {
      toast.error("Error registering you");
      router.push("/");
    },
  });
};
export default useRegisterLandlordMutation;
