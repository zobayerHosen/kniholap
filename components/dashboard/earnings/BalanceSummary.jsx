"use client";
import { useQuery } from "@tanstack/react-query";
import BalanceSummaryCard from "./BalanceSummaryCard";
import PayOutsList from "./PayOutsList";
import { axiosPrivateClient } from "@/lib/axios.private.client";

// Note: dummy data
const balanceCardData = [
    {
        id: 1,
        amount: 300,
        balanceText: "Current Balance:"
    },
    {
        id: 2,
        amount: 420,
        balanceText: "Total Sales:"
    },
    {
        id: 3,
        amount: 420,
        balanceText: "Withdrawable Amount:"
    },
];

const BalanceSummary = () => {
    const axiosInstance = axiosPrivateClient();

    const { data: earningsData, isLoading, isFetching, isError } = useQuery({
        queryKey: ["earnings-data"],
        queryFn: async () => {
            const response = await axiosInstance.get(`/auth/account/transactions`);
            return response?.data?.data || []
        }
    });

    // Note: main ui component
    return (
        <div className="w-full mt-8">
            <p className="text-2xl text-[#0A0910] font-medium mb-4 lg:mb-8">Balance / Summary</p>

            {/* balance card */}
            <div className="w-full grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
                {
                    balanceCardData?.map((item) => {
                        return (
                            <BalanceSummaryCard
                                key={item?.id}
                                item={item}
                            />
                        )
                    })
                }
            </div>

            <PayOutsList
                earningsData={earningsData}
                isLoading={isLoading}
                isFetching={isFetching}
                isError={isError}
            />
        </div>
    );
};
export default BalanceSummary;