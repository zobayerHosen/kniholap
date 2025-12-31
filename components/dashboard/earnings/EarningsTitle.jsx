"use client";
import CommonDashboardTitle from "@/components/common/CommonDashboardTitle";
import { axiosPrivateClient } from "@/lib/axios.private.client";
import { useMutation, useQuery } from "@tanstack/react-query";


const EarningsTitle = () => {
    const axiosInstance = axiosPrivateClient();

    // Note: connect account api
    const connectAccountMutation = useMutation({
        mutationKey: ["connect-account"],
        mutationFn: async () => {
            const response = await axiosInstance.post(
                "/auth/account/user/onboarding"
            );
            return response?.data;
        },
        onSuccess: (data) => {
            const url = data?.data?.url;

            if (url) {
                window.location.href = url;
            }
        },
    });

    // Note: check is connected
    const { data: checkConnect, isLoading: checkingConnect } = useQuery({
        queryKey: ["check-connect-account"],
        queryFn: async () => {
            const response = await axiosInstance.get(
                "/auth/account/connect/check"
            );
            return response?.data?.data;
        },
    });
    const isConnected = checkConnect?.is_connect === true

    // Note: main ui component
    return (
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            {/* left side */}
            <CommonDashboardTitle
                text="Earnings"
            />

            <div className="flex items-center gap-4">
                {/* connect account button */}
                <button
                    onClick={() => connectAccountMutation.mutate()}
                    disabled={connectAccountMutation.isPending}
                    className={`cursor-pointer flex items-center gap-2 p-3 rounded-full transition-all duration-300 ease-in-out w-full sm:w-auto justify-center ${connectAccountMutation.isPending
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : isConnected
                            ? "bg-green-600 text-white hover:bg-green-700 hover:shadow-md"
                            : "bg-[#7C2709] text-white hover:bg-white hover:text-black hover:scale-105 hover:shadow-md"
                        }`}
                >
                    {connectAccountMutation.isPending
                        ? "Connecting..."
                        : isConnected
                            ? "Check your balance"
                            : "Connect Account"}
                </button>


                {/* right side */}
                <button
                    className="cursor-pointer flex items-center gap-2 p-3 rounded-full bg-[#7C2709] text-white hover:bg-white hover:text-black hover:scale-105 hover:shadow-md transition-all duration-300 ease-in-out w-full sm:w-auto justify-center"
                >
                    Withdraw Earnings
                </button>
            </div>
        </div>
    );
};
export default EarningsTitle;