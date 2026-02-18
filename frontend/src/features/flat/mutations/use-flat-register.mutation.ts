import { registerFlat } from "@/features/flat/api/mutation.api";
import { RegisterFlatSchemaType } from "@/features/flat/schemas/register-flat.schema";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useFlatRegisterMutation = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: RegisterFlatSchemaType) => registerFlat(data),
    onSuccess() {
      toast.success(`succesfully regesterd your flat `);
      // router.push(`/flats`);
    },
    onError() {
      toast.error("Error Registereing Flat :( !");
    },
  });
};

export default useFlatRegisterMutation;
