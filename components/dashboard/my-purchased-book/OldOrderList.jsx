"use client";
import { useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import CommonDashboardTitle from "@/components/common/CommonDashboardTitle";
import recentOrderImage1 from "@/public/recent_orders/orderImage1.png";
import recentOrderImage2 from "@/public/recent_orders/orderImage2.png";
import recentOrderImage3 from "@/public/recent_orders/orderImage3.png";
import RecentOrdersCard from "../dashboardHome/RecentOrdersCard";
import { MdOutlineDateRange } from "react-icons/md";

const dashboardRecentOrders = [
    {
        id: 1,
        title: "Atomic Habits",
        orderId: "#12345",
        status: "Pending",
        image: recentOrderImage1,
    },
    {
        id: 2,
        title: "The Power of Habit",
        orderId: "#12346",
        status: "Delivered",
        image: recentOrderImage2,
    },
    {
        id: 3,
        title: "Deep Work",
        orderId: "#12347",
        status: "Pending",
        image: recentOrderImage3,
    },
];

const OldOrderList = () => {
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setOpen(false);
    };

    return (
        <div className="w-full mt-10 xl:mt-[60px]">
            <div className="w-full flex items-center justify-between relative">
                <CommonDashboardTitle text="Order List" />

                {/* Custom DatePicker Button */}
                <DatePicker
                    open={open}
                    onOpenChange={setOpen}
                    onChange={handleDateChange}
                    value={selectedDate}
                    renderExtraFooter={null}
                    // popupClassName="custom-calendar-popup"
                    suffixIcon={null}
                    allowClear={false}
                    className="flex items-center"
                />

                <button
                    onClick={() => setOpen(!open)}
                    className="cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 p-2 text-black hover:text-black hover:scale-105 transition-all duration-300 ease-in-out"
                >
                    <MdOutlineDateRange className="size-6" />
                </button>
            </div>

            {/* Recent Orders */}
            <div className="w-full grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 lg:gap-6 mt-4 xl:mt-8">
                {dashboardRecentOrders?.map((item) => (
                    <RecentOrdersCard key={item?.id} item={item} />
                ))}
            </div>
        </div>
    );
};
export default OldOrderList;