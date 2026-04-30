import { useQuery } from "@tanstack/react-query";
import { axiosPrivateClient } from "@/lib/axios.private.client";

const useBookAllReview = () => {
    const axiosInstance = axiosPrivateClient();
    // note: get all book review data
    const { data, isLoading, isError } = useQuery({
        queryKey: ["bookAllReview"],
        queryFn: async () => {
            const response = await axiosInstance.get(`/book/review/list`);
            return response?.data;
        },
    });
    return {
        data,
        isLoading,
        isError,
    };
};
export default useBookAllReview;