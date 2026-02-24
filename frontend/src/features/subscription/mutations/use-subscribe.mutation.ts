import { subscribe } from "@/features/subscription/api/mutation.api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const useSubscribeMutation = () => {
  return useMutation({
    mutationFn: (data: "free" | "standard" | "premium") => subscribe(data),
    onSuccess() {
      toast.success(`succesfully made your subscription plan`);
      //   router.push(`/tenants`);
    },

    onError() {
      toast.error("Error Editing tenant :( !");
    },
  });
};

export default useSubscribeMutation;
