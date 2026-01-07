import EmptyState from '@/components/common/EmptyState.';
import ErrorState from '@/components/common/ErrorState';
import React from 'react';
import { BiCheckCircle } from 'react-icons/bi';

const DesktopTableView = ({ payouts, renderStatusColor, isLoading, isFetching, isError }) => {
    // Show loading state
    if (isLoading || isFetching) {
        return (
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-start border-separate border-spacing-y-3 min-w-[400px]">
                    <thead>
                        <tr className="text-gray-600">
                            <th className="py-2 px-4 text-sm lg:text-base">Date</th>
                            <th className="py-2 px-4 text-sm lg:text-base">Amount</th>
                            <th className="py-2 px-4 text-sm lg:text-base">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(5)].map((_, index) => (
                            <tr key={index} className="w-full bg-gray-50 hover:bg-gray-100 rounded-lg shadow-sm text-center">
                                <td className="py-3 px-4 rounded-l-lg">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mx-auto"></div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16 mx-auto"></div>
                                </td>
                                <td className="py-3 px-4 rounded-r-lg">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                                        <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    // Show error state
    if (isError) {
        return (
            <ErrorState />
        );
    }

    // Show empty state
    if (!payouts || payouts.length === 0) {
        return (
            <EmptyState />
        );
    }

    return (
        <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-start border-separate border-spacing-y-3 min-w-[400px]">
                <thead>
                    <tr className="text-gray-600">
                        <th className="py-2 px-4 text-sm lg:text-base">Date</th>
                        <th className="py-2 px-4 text-sm lg:text-base">Amount</th>
                        <th className="py-2 px-4 text-sm lg:text-base">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {payouts?.map((payout, index) => (
                        <tr
                            key={index}
                            className="w-full bg-gray-50 hover:bg-gray-100 rounded-lg shadow-sm text-center"
                        >
                            <td className="py-3 px-4 rounded-l-lg text-sm lg:text-base">{payout?.created_at}</td>
                            <td className="py-3 px-4 text-sm lg:text-base">{payout?.amount}</td>
                            <td
                                className={`w-full text-center py-3 px-4 flex items-center justify-center gap-2 rounded-r-lg ${renderStatusColor(
                                    payout?.status
                                )}`}
                            >
                                <span className="text-sm lg:text-base">{payout?.status}</span>
                                <BiCheckCircle className="w-4 h-4" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default DesktopTableView;