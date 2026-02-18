import { registerTenant } from "@/features/tenant/api/mutation.api";
import { RegisterTenantSchemaType } from "@/features/tenant/schemas/register-tenant.schema";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useTenantRegisterMutation = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: RegisterTenantSchemaType) => registerTenant(data),
    onSuccess() {
      toast.success(`succesfully regesterd your tenant`);
      // router.push(`/tenants`);
    },
    onError() {
      toast.error("Error Registereing tenant :( !");
    },
  });
};

export default useTenantRegisterMutation;
