"use client"
import CommonDashboardTitle from '@/components/common/CommonDashboardTitle';
import recentOrderImage1 from "@/public/recent_orders/orderImage1.png"
import recentOrderImage2 from "@/public/recent_orders/orderImage2.png"
import recentOrderImage3 from "@/public/recent_orders/orderImage3.png"
import RecentOrdersCard from './RecentOrdersCard';
import { useQuery } from '@tanstack/react-query';

// Note: recent orderd dummy data
const recentOrdersData = [
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

const RecentOrders = () => {
    // Note: recent orders
    const { data: recentOrders } = useQuery({
        queryKey: ["recent-orders"],
        queryFn: async () => {
            const response = await axiosInstance.get(``);
            return response?.data || [];
        }
    });
    console.log("Recent orders : -----> ", recentOrders);

    // Note: main ui component
    return (
        <div className='w-full mt-10 lg:mt-[60px]'>
            <CommonDashboardTitle
                text='Recent Orders'
            />

            {/* recent order cards */}
            <div className='w-full grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 lg:gap-6 mt-4 xl:mt-8'>
                {
                    recentOrdersData?.map(item => {
                        return (
                            <RecentOrdersCard
                                key={item?.id}
                                item={item}
                            />
                        )
                    })
                }
            </div>
        </div>
    );
};
export default RecentOrders;