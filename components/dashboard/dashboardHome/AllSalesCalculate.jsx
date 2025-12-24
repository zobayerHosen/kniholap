"use client"
import bookImg from "@/public/books/dashBookImge.png"
import saleImg from "@/public/books/totalSale.png"
import earningsImg from "@/public/books/totalEarning.png"
import deliveredImg from "@/public/books/totalDelivered.png"
import SalesCalculateCart from "./SalesCalculateCart";
import { useUser } from "@/hooks/get-user.hook";

const AllSalesCalculate = () => {
    const { userData } = useUser();
    const { total_books, total_delivered, total_ratings } = userData || {};
    console.log(userData)

    const allSalesCalculateData = [
        {
            id: 1,
            title: "Total Books",
            value: total_books,
            image: bookImg
        },
        {
            id: 2,
            title: "Total Sale",
            value: 154,
            image: saleImg
        },
        {
            id: 3,
            title: "Total Earnings",
            value: 1544,
            image: earningsImg
        },
        {
            id: 4,
            title: "Total Deliverd",
            value: total_delivered,
            image: deliveredImg
        },
    ];
    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 2xl:gap-[30px] mt-5 2xl:mt-8">
            {
                allSalesCalculateData?.map((item) => {
                    return (
                        <SalesCalculateCart
                            key={item?.id}
                            item={item}
                        />
                    )
                })
            }
        </div>
    );
};
export default AllSalesCalculate;