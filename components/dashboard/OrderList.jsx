"use client";

import CommonDashboardTitle from "@/components/common/CommonDashboardTitle";
import { useQuery } from "@tanstack/react-query";
import { axiosPrivateClient } from "@/lib/axios.private.client";
import EmptyState from "@/components/common/EmptyState.";
import ErrorState from "@/components/common/ErrorState";
import BookCardSkeleton from "@/components/BookCardSkeleton";
import { useState } from "react";
import DashboardBookCard from "@/components/dashboard/DashboardBookCard";

const OrdersList = ({
    title,
    queryKey,
    endpoint,
    type, // Note: "sold" | "purchased"
}) => {
    const axiosInstance = axiosPrivateClient();
    const [perPage] = useState(4);

    // Note: dynamically received API endpoint
    const {
        data = [],
        isLoading,
        isFetching,
        isError,
    } = useQuery({
        queryKey,
        queryFn: async () => {
            const res = await axiosInstance.get(endpoint);
            return res?.data?.data || [];
        },
    });

    // Note: main ui part
    return (
        <div className="w-full">
            <CommonDashboardTitle text={title} />

            <div className="w-full mt-8">
                {(isLoading || isFetching) ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {Array.from({ length: perPage }).map((_, i) => (
                            <BookCardSkeleton key={i} />
                        ))}
                    </div>
                ) : isError ? (
                    <ErrorState />
                ) : data?.length === 0 ? (
                    <EmptyState
                        className="py-20"
                        description="No books found with these filters or no books available"
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {data?.map((book) => (
                            <DashboardBookCard
                                key={book.id}
                                book={book}
                                type={type}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default OrdersList;