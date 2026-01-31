import { login } from "@/features/auth/api/mutations.api";
import { LoginSchemaType } from "@/features/auth/schemas/login.schema";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useLoginMutation = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: LoginSchemaType) => login(data),
    onSuccess() {
      toast.success(`welcome back : `);
      router.push(`/`);
    },
    onError() {
      toast.error("Error loggin you in!");
    },
  });
};

export default useLoginMutation;
