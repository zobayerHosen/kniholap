"use client"
import CommonDashboardTitle from '@/components/common/CommonDashboardTitle';
import recentOrderImage1 from "@/public/recent_orders/orderImage1.png"
import recentOrderImage2 from "@/public/recent_orders/orderImage2.png"
import recentOrderImage3 from "@/public/recent_orders/orderImage3.png"
import RecentOrdersCard from '../dashboardHome/RecentOrdersCard';

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
    return (
        <div className='w-full'>
            <CommonDashboardTitle
                text='My Purchesed Books'
            />

            {/* recent order cards */}
            <div className='w-full grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 lg:gap-6 mt-4 xl:mt-8'>
                {
                    dashboardRecentOrders?.map(item => {
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
export default DashboardOrdersList;