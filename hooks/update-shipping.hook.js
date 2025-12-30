import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosPrivateClient } from "@/lib/axios.private.client";

const useUpdateShippingOrder = () => {
  const axiosInstance = axiosPrivateClient();

  return useMutation({
    mutationKey: ["shipping-update"],
    mutationFn: async (payload) => {
      const response = await axiosInstance.post(
        "/auth/seller/order/shipping/update",
        payload
      );
      return response?.data;
    },
    onSuccess: (data) => {
      toast.success(
        data?.message || "Shipping information updated successfully."
      );
    },
    onError: () => {
      toast.error("Failed to update shipping info");
    },
  });
};
export default useUpdateShippingOrder;
