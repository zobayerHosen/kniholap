"use client";
import CommonDashboardTitle from "@/components/common/CommonDashboardTitle";
import ReviewCard from "./ReviewCard";
import { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import { axiosPrivateClient } from "@/lib/axios.private.client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/auth.hook";

// Note: dummy review data
// const reviewsData = [
//     {
//         id: 1,
//         name: "John Doe",
//         rating: 4.5,
//         avatar: "https://i.pravatar.cc/150?img=1",
//         review: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, autem?",
//     },
//     {
//         id: 2,
//         name: "Jane Smith",
//         rating: 5,
//         avatar: "https://i.pravatar.cc/150?img=2",
//         review: "Excellent platform! Easy to use and great support.",
//     },
//     {
//         id: 3,
//         name: "Alex Turner",
//         rating: 4,
//         avatar: "https://i.pravatar.cc/150?img=3",
//         review: "Good experience overall. Would definitely recommend.",
//     },
//     {
//         id: 4,
//         name: "Lisa Ray",
//         rating: 4.8,
//         avatar: "https://i.pravatar.cc/150?img=4",
//         review: "Absolutely loved working here!",
//     },
//     {
//         id: 5,
//         name: "Lisa Ray",
//         rating: 4.8,
//         avatar: "https://i.pravatar.cc/150?img=4",
//         review: "Absolutely loved working here!",
//     },
// ];

const DashboardReviews = () => {
    const axiosInstance = axiosPrivateClient();
    const { accessToken } = useAuth();
    const [startIndex, setStartIndex] = useState(0);
    const visibleCount = 3;

    const { data: getReviewData = [], refetch } = useQuery({
        queryKey: ["personal-review"],
        queryFn: async () => {
            const response = await axiosInstance.get(`/auth/seller/review/list`);
            return response?.data?.data || [];
        },
    });

    console.log("Personal review:--->", getReviewData);

    // Note: handle Next
    const handleNext = () => {
        if (startIndex + visibleCount < getReviewData?.length) {
            setStartIndex(startIndex + 1);
        }
    };

    // Note: handle Previous
    const handlePrevious = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - 1);
        }
    };

    const visibleReviews = getReviewData?.slice(startIndex, startIndex + visibleCount);
    // Note: main ui component
    return (
        <div className="w-full mt-8">
            <CommonDashboardTitle text="Reviews" />

            {/* Review List */}
            {getReviewData.length === 0 ? (
                <p className="col-span-full text-center text-gray-500">
                    No reviews found
                </p>
            ) : (
                <div className="w-full mt-6 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-3 gap-4">
                    {
                        visibleReviews.map(review => (
                            <ReviewCard key={review.id} review={review} />
                        ))
                    }
                </div>
            )}
            {/* Previous and Next Buttons */}
            <div className="w-full flex justify-end items-center gap-3 mt-6">
                <button
                    onClick={handlePrevious}
                    disabled={startIndex === 0}
                    className="bg-[#A5340C] text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                    <FaChevronLeft />
                </button>
                <button
                    onClick={handleNext}
                    disabled={startIndex + visibleCount >= getReviewData?.length}
                    className="bg-[#A5340C] text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                    <FaChevronRight />
                </button>
            </div>
        </div>
    );
};
export default DashboardReviews;