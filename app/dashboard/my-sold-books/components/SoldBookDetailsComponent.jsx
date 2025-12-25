"use client";
import Image from "next/image";
import dummyImage from "@/public/dummyImage.png";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosPrivateClient } from "@/lib/axios.private.client";

const SoldBookDetailsComponent = ({ params_id }) => {
    console.log("Params ID ----> ", params_id)
    const axiosInstance = axiosPrivateClient();

    // Note: get sold book details
    const { data: getSoldBookDetails, isloading } = useQuery({
        queryKey: ['sold-book-details', params_id],
        queryFn: async () => {
            const response = await axiosInstance.get(`/auth/seller/order/details/${params_id}`);
            return response?.data?.data || {};
        },
        enabled: !!params_id
    });
    console.log("Sold book details data: --->", getSoldBookDetails);

    const {
        order_number,
        total_amount,
        book_price,
        shipping_cost,
        platform_fee,
        shipping_address,
        status,
        paid_at,
        book = {},
    } = getSoldBookDetails || {};

    const { title, author, cover_image, type, price } = book;
    const [imageSrc, setImageSrc] = useState(cover_image || dummyImage);

    return (
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ================= Left Side : Sold Book Details ================= */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6  shadow-sm">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Sold Book Details
                    </h2>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize">
                        {status}
                    </span>
                </div>

                {/* Book Info */}
                <div className="flex flex-col sm:flex-row gap-6">
                    {/* Book Image */}
                    <div className="relative w-full sm:w-40 h-52 bg-gray-50 rounded-xl overflow-hidden">
                        <Image
                            src={imageSrc}
                            alt={title || ""}
                            fill
                            className="object-contain p-4"
                            onError={() => setImageSrc(dummyImage)}
                        />
                    </div>

                    {/* Book Meta */}
                    <div className="flex-1 space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-600">
                            by {author}
                        </p>

                        <div className="text-sm text-gray-700 pt-2 space-y-1">
                            <p>Book Type: <span className="font-medium">{type}</span></p>
                            <p>Book Price: <span className="font-medium">${price}</span></p>
                            <p>Order ID: <span className="font-medium">{order_number}</span></p>
                            <p>Paid At: <span className="font-medium">{paid_at}</span></p>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-6 border-t" />

                {/* Order Summary */}
                <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4">
                        Order Summary
                    </h4>

                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                        <p className="text-gray-600">Book Price</p>
                        <p className="text-right font-medium">${book_price}</p>

                        <p className="text-gray-600">Shipping Cost</p>
                        <p className="text-right font-medium">${shipping_cost}</p>

                        <p className="text-gray-600">Platform Fee</p>
                        <p className="text-right font-medium">${platform_fee}</p>

                        <div className="col-span-2 border-t my-2" />

                        <p className="text-gray-900 font-semibold">Total Amount</p>
                        <p className="text-right font-semibold text-gray-900">
                            ${total_amount}
                        </p>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="mt-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-2">
                        Shipping Address
                    </h4>
                    <p className="text-sm text-gray-600">
                        {shipping_address}
                    </p>
                </div>
            </div>

            {/* ================= Right Side : Chat with Buyer ================= */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col">

                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Chat with Buyer
                </h2>

                {/* Chat Messages Area */}
                <div className="flex-1 bg-gray-50 rounded-xl p-4 overflow-y-auto text-sm text-gray-500 flex items-center justify-center">
                    Chat messages will appear here
                </div>

                {/* Chat Input */}
                <div className="mt-4 flex gap-2">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button className="px-4 py-2 rounded-xl bg-[#7C2709] text-white text-sm font-medium hover:bg-[#5f1f07] transition">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};
export default SoldBookDetailsComponent;