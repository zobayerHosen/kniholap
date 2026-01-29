"use client";
import { useQuery } from "@tanstack/react-query";
import BalanceSummaryCard from "./BalanceSummaryCard";
import PayOutsList from "./PayOutsList";
import { axiosPrivateClient } from "@/lib/axios.private.client";

const BalanceSummary = () => {
    const axiosInstance = axiosPrivateClient();

    const { data: earningsData, isLoading, isFetching, isError } = useQuery({
        queryKey: ["earnings-data"],
        queryFn: async () => {
            const response = await axiosInstance.get(`/auth/account/transactions`);
            return response?.data?.data || []
        }
    });
    const earningsTransactions = earningsData?.transactions || []
    const summaryData = earningsData?.summary;

    // Note: transation cards
    const balanceCards = [
        {
            id: 1,
            amount: summaryData?.current_available_balance,
            balanceText: "Current Balance",
            currency: summaryData?.currency,
        },
        {
            id: 2,
            amount: summaryData?.total_received_from_platform,
            balanceText: "Total Sales",
            currency: summaryData?.currency,
        },
        {
            id: 3,
            amount: summaryData?.current_total_balance,
            balanceText: "Withdrawable Amount",
            currency: summaryData?.currency,
        },
    ];

    // Note: main ui component
    return (
        <div className="w-full mt-8">
            <p className="text-2xl text-[#0A0910] font-medium mb-4 lg:mb-8">Balance / Summary</p>

            {/* balance card */}
            <div className="w-full grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
                {
                    balanceCards?.map((item) => {
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
                earningsData={earningsTransactions}
                isLoading={isLoading}
                isFetching={isFetching}
                isError={isError}
            />
        </div>
    );
};
export default BalanceSummary;