import { editTenant } from "@/features/tenant/api/mutation.api";
import { RegisterTenantSchemaType } from "@/features/tenant/schemas/register-tenant.schema";
import { Tenant } from "@/features/tenant/schemas/tenant.schema";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useTenantEditMutation = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: Tenant) => editTenant(data),
    onSuccess() {
      toast.success(`succesfully regesterd your tenant`);
      router.push(`/tenants`);
    },
    onError() {
      toast.error("Error Editing tenant :( !");
    },
  });
};

export default useTenantEditMutation;
