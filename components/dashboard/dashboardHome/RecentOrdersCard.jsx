"use client";
import Image from "next/image";

const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    shipped: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
};

const RecentOrdersCard = ({ item }) => {
    const { title, orderId, status, image } = item;

    // Note: min ui card
    return (
        <div
            className="group w-full rounded-2xl p-5 bg-gradient-to-br from-[#FFF7F4] via-white to-[#FDF2EE] border border-[#f0e4df] shadow-sm hover:shadow-xl transition-all duration-300 "
        >
            {/* Image */}
            <div className="relative w-full h-44 bg-white/80 backdrop-blur rounded-xl overflow-hidden flex items-center justify-center">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Content */}
            <div className="mt-4 space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {title}
                </h3>

                {/* Order info */}
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Order #{orderId}</span>

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

            {/* Action */}
            <button
                className="mt-5 w-full py-2 rounded-xl text-sm font-semibold bg-[#7C2709] text-white hover:bg-[#5f1f07] hover:shadow-md active:scale-95 transition-all duration-300"
            >
                Ship Now
            </button>
        </div>
    );
};
export default RecentOrdersCard;