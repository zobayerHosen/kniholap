"use client";
import Image from "next/image";
import dummyImage from "@/public/dummyImage.png"
import { useState } from "react";
import Link from "next/link";

// Note: Status colors similar to the RecentOrdersCard
const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    shipped: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    sold: "bg-purple-100 text-purple-700",
    available: "bg-gray-100 text-gray-700",
};

// Note: Book card component matching the RecentOrdersCard design
const RecentOrdersCard = ({ book }) => {
    const { id, status, soldDate, buyer, book: bookInfo = {} } = book || {};
    const { title, cover_image, author: bookAuthor, price, } = bookInfo;
    const [imageSrc, setImageSrc] = useState(cover_image || dummyImage);

    // Note: main ui component
    return (
        <div className="group w-full rounded-2xl p-5 bg-gradient-to-br from-[#FFF7F4] via-white to-[#FDF2EE] border border-[#f0e4df] shadow-sm hover:shadow-xl transition-all duration-300">
            {/* Book Image */}
            <div className="relative w-full h-44 bg-white/80 backdrop-blur rounded-xl overflow-hidden flex items-center justify-center">
                <Image
                    src={imageSrc}
                    alt={title || ''}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    onError={() => setImageSrc(dummyImage)}
                />
            </div>

            {/* Content */}
            <div className="mt-4 space-y-3">
                {/* Title and Author */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {title || "N/A"}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">by {bookAuthor}</p>
                </div>

                {/* Book Details */}
                <div className="flex items-center justify-between text-sm">
                    <div className="space-y-1">
                        <div className="text-gray-600">
                            Sold Price: <span className="font-semibold text-gray-900">${price}</span>
                        </div>
                        {soldDate && (
                            <div className="text-gray-600 text-xs">
                                Sold on: {soldDate}
                            </div>
                        )}
                        {buyer && (
                            <div className="text-gray-600 text-xs">
                                Buyer: {buyer}
                            </div>
                        )}
                    </div>

                    {/* Status badge */}
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[status?.toLowerCase()] ||
                            "bg-gray-100 text-gray-600"
                            }`}
                    >
                        {status}
                    </span>
                </div>
            </div>

            {/* Action Buttons view details and chat */}
            <div className="w-full flex items-center gap-3 mt-5">
                <Link
                    href={`/dashboard/my-purchased-book/${id}`}
                    className="w-full block text-center py-2 rounded-xl text-sm font-semibold bg-[#7C2709] text-white hover:bg-[#5f1f07] hover:shadow-md active:scale-95 transition-all duration-300"
                >
                    View Details
                </Link>

                <Link
                    href={`/dashboard/chat-book-seller/${id}`}
                    
                    className="w-full block text-center py-2 rounded-xl text-sm font-semibold bg-[#7C2709] text-white hover:bg-[#5f1f07] hover:shadow-md active:scale-95 transition-all duration-300"
                >
                    Chat
                </Link>
            </div>
        </div>
    );
};
export default RecentOrdersCard;