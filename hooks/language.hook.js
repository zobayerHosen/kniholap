"use client";
import { axiosPrivateClient } from "@/lib/axios.private.client";
import { useQuery } from "@tanstack/react-query";

const useGetLanguageOptions = () => {
  const axiosInstance = axiosPrivateClient();

  const { data: getLanguage } = useQuery({
    queryKey: ["get-language"],
    queryFn: async () => {
      const response = await axiosInstance.get("/language/list");
      return response?.data?.data;
    },
  });

  return { getLanguage };
};

export default useGetLanguageOptions;
