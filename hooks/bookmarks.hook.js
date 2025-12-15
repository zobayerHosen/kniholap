import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosPrivateClient } from "@/lib/axios.private.client";
import toast from "react-hot-toast";

const useBookMarks = () => {
  const axiosInstance = axiosPrivateClient();
  const queryClient = useQueryClient();

  // Note: handle book marks mutation
  const handleBookMarksMutation = useMutation({
    mutationKey: ["addBookMarks"],
    mutationFn: async (data) => {
      const response = await axiosInstance.post(`/auth/wishlist/store`, data);
      return response?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Book add to bookmarks successfully!");
      queryClient.invalidateQueries({
        queryKey: ["getBookmarksList"],
        exact: true,
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    },
  });

  // Note: export all things
  return {
    handleBookMarksMutation,
  };
};
export default useBookMarks;
