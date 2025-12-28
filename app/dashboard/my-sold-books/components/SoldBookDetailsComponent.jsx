"use client";
import Image from "next/image";
import dummyImage from "@/public/dummyImage.png";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosPrivateClient } from "@/lib/axios.private.client";
import MessageInput from "../../chat-book-seller/components/MessageInput";
import Message from "../../chat-book-seller/components/Message";
import { AnimatePresence } from "framer-motion";
import EmptyScreen from "../../chat-book-seller/components/EmptyScreen";
import { useUser } from "@/hooks/get-user.hook";
import { useSearchParams } from "next/navigation";

// Note: dummy user and message
const messages = [
    {
        id: 1,
        message: "Hi, I’ve just placed the order. When will it be shipped?",
        sent_at: "10:15 AM",
        sender_id: 2,
        sender_name: "Buyer John",
    },
    {
        id: 2,
        message: "Hello! Thanks for your order. I will ship it within 24 hours.",
        sent_at: "10:17 AM",
        sender_id: 1, // current user (seller)
        sender_name: "You",
    },
    {
        id: 3,
        message: "Great! Please let me know once it’s shipped 😊",
        sent_at: "10:18 AM",
        sender_id: 2,
        sender_name: "Buyer John",
    },
    {
        id: 4,
        message: "Sure! I’ll also share the tracking number.",
        sent_at: "10:20 AM",
        sender_id: 1,
        sender_name: "You",
    },
];

const SoldBookDetailsComponent = ({ params_id, showChat }) => {
    const searchParams = useSearchParams();
    const role = searchParams.get("role");
    const { messagesEndRef, roomData, userData } = useUser()
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

    // Note: destructure all properties
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
        <div className={`w-full grid gap-6 ${showChat ? "lg:grid-cols-3" : "lg:grid-cols-1"}`}>

            {/* ================= Left Side : Sold Book Details ================= */}
            <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm">

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
            {
                showChat && (
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm flex flex-col">

                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            {role === "seller" ? "Chat with Buyer" : "Chat with Seller"}
                        </h2>

                        {/* Chat Messages Area */}
                        {messages?.length === 0 ? (
                            <EmptyScreen />
                        ) : (
                            <div className="w-full border border-t-0 border-slate-300 mb-2 h-full p-2 md:p-4 overflow-y-auto">
                                {/* Animate message appearance/disappearance */}
                                <AnimatePresence>
                                    {messages?.map((message) => (
                                        <Message
                                            key={message.id}
                                            message={message}
                                            isCurrentUser={message.sender_id === userData?.id}
                                            isTemp={message.isTemp}
                                            otherUser={roomData?.receiver}
                                        />
                                    ))}
                                </AnimatePresence>
                                {/* Invisible element for scrolling to bottom */}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                        {/* Chat Input */}
                        <MessageInput />
                    </div>
                )
            }

        </div>
    );
};
export default SoldBookDetailsComponent;