import { useQuery } from "@tanstack/react-query";
import { axiosPrivateClient } from "@/lib/axios.private.client";

const useBooks = ({
  filters = {},
  currentPage = 1,
  perPage,
  orderby = "desc",
}) => {
  const axiosInstance = axiosPrivateClient();

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["books", filters, currentPage, perPage, orderby],
    queryFn: async () => {
      const response = await axiosInstance.get("/book/list", {
        params: {
          current_page: currentPage || 1,
          per_page: perPage || 4,
          search: filters.search || null,
          category_ids: filters.category_ids || null,
          type: filters.type || null,
          order_by: orderby,
          language_id: filters.language_id || null,
        },
      });
      return response?.data?.data || {};
    },
    keepPreviousData: true,
    retry: false,
  });

  // Normalised data
  const books = data?.books || [];
  const pagination = data?.pagination || {
    last_page: 1,
    total: 0,
    per_page: perPage,
    current_page: currentPage,
  };

  return {
    books,
    pagination,
    isLoading,
    isFetching,
    isError,
    refetch,
  };
};

export default useBooks;
