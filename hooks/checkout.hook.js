import { axiosPrivateClient } from "@/lib/axios.private.client";
import { useMutation } from "@tanstack/react-query";

const useCheckout = () => {
  const axiosInstance = axiosPrivateClient();

  const handleCheckoutMutation = useMutation({
    mutationKey: ["handleCheckout"],
    mutationFn: async ({ book_id }) => {
      const response = await axiosInstance.post(
        `/auth/create/checkout-session`,
        {book_id}
      );
      return response?.data;
    },
    onSuccess: (data) => {
      const url = data?.data?.checkout_url;
      // Note: Redirect to the checkout URL
      // if (url) {
      //     window.location.href = url;
      // } else {
      //     console.error("checkout_url missing in API response:", data);
      // }
      // Note: using ternary operator
      url
        ? (window.location.href = url)
        : console.error("checkout_url missing in API response:", data);
    },
    onError: (error) => {
      // >>>
    },
  });

  return {
    handleCheckoutMutation,
  };
};
export default useCheckout;
