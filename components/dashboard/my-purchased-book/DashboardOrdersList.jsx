"use client"
import CommonDashboardTitle from '@/components/common/CommonDashboardTitle';
import recentOrderImage1 from "@/public/recent_orders/orderImage1.png"
import recentOrderImage2 from "@/public/recent_orders/orderImage2.png"
import recentOrderImage3 from "@/public/recent_orders/orderImage3.png"
import RecentOrdersCard from '../dashboardHome/RecentOrdersCard';
import { useQuery } from '@tanstack/react-query';
import { axiosPrivateClient } from '@/lib/axios.private.client';
import EmptyState from '@/components/common/EmptyState.';
import ErrorState from '@/components/common/ErrorState';
import BookCardSkeleton from '@/components/BookCardSkeleton';
import { useState } from 'react';

// Note: recent orderd dummy data
const dashboardRecentOrders = [
    {
        id: 1,
        title: "Atomic Habits",
        orderId: "#12345",
        status: "Pending",
        image: recentOrderImage1
    },
    {
        id: 2,
        title: "The Power of Habit",
        orderId: "#12346",
        status: "Delivered",
        image: recentOrderImage2
    },
    {
        id: 3,
        title: "Deep Work",
        orderId: "#12347",
        status: "Pending",
        image: recentOrderImage3
    }
];

const DashboardOrdersList = () => {
    const axiosInstance = axiosPrivateClient();
    const [perPage, setPerPage] = useState(4)

    // Note: get recent oreders
    const { data: getMyPurchasedOrders, isLoading, isFetching, isError } = useQuery({
        queryKey: ["my-purchased-book"],
        queryFn: async () => {
            const response = await axiosInstance.get(`/auth/buyer/order/list`);
            return response?.data?.data || [];
        }
    });
    console.log("My purchased data ---->", getMyPurchasedOrders);

    // Note: main ui component
    return (
        <div className='w-full'>
            <CommonDashboardTitle
                text='My Purchesed Books'
            />

            {/* recent order cards */}
            <div className="w-full mt-8">
                {/* Loading */}
                {(isLoading || isFetching) ? (
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {Array.from({ length: perPage }).map((_, i) => (
                            <BookCardSkeleton key={i} />
                        ))}
                    </div>
                ) : isError ? (
                    <ErrorState />
                ) : getMyPurchasedOrders?.length === 0 ? (
                    <EmptyState
                        className="py-20"
                        description="No books found with these filters or no books available"
                    />
                ) : (
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {getMyPurchasedOrders?.map((book) => (
                            <RecentOrdersCard key={book.id} book={book} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default DashboardOrdersList;