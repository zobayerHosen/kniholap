"use client";
import CommonDashboardTitle from "@/components/common/CommonDashboardTitle";
import SoldBookCard from "./MySoldBookCard";
import { useQuery } from "@tanstack/react-query";
import { axiosPrivateClient } from "@/lib/axios.private.client";
import BookCardSkeleton from "@/components/BookCardSkeleton";
import { useState } from "react";

// const soldBooks = [
//     {
//         id: 1,
//         title: "The Great Gatsby",
//         author: "F. Scott Fitzgerald",
//         price: "29.99",
//         status: "completed",
//         image: "/book1.jpg",
//         soldDate: "2024-01-15",
//         buyer: "John Doe"
//     },
//     {
//         id: 2,
//         title: "To Kill a Mockingbird",
//         author: "Harper Lee",
//         price: "24.99",
//         status: "shipped",
//         image: "/book2.jpg",
//         soldDate: "2024-01-14",
//         buyer: "Jane Smith"
//     },
//     {
//         id: 3,
//         title: "1984",
//         author: "George Orwell",
//         price: "19.99",
//         status: "pending",
//         image: "/book3.jpg",
//         soldDate: "2024-01-13",
//         buyer: "Robert Johnson"
//     },
//     {
//         id: 4,
//         title: "Pride and Prejudice",
//         author: "Jane Austen",
//         price: "22.99",
//         status: "sold",
//         image: "/book4.jpg",
//         soldDate: "2024-01-12",
//         buyer: "Emily Davis"
//     },
// ];

const MySoldBooks = () => {
    const axiosInstance = axiosPrivateClient();
    const [perPage, setPerPage] = useState(4);

    // Note: Get my sold books data as a seller (logged in user)
    const { data: sellingBook, isLoading, isFetching, isError } = useQuery({
        queryKey: ["selling-book"],
        queryFn: async () => {
            const response = await axiosInstance.get(`/auth/seller/order/list`);
            return response?.data?.data || [];
        }
    });
    console.log("Get seller data : ---->", sellingBook);

    // Note: UI component
    return (
        <div className='w-full'>
            <CommonDashboardTitle
                text='My Sold Books'
            />

            {/* my sold book card */}
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
                ) : sellingBook?.length === 0 ? (
                    <EmptyState
                        className="py-20"
                        description="No books found with these filters or no books available"
                    />
                ) : (
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {sellingBook?.map((book) => (
                            <SoldBookCard key={book.id} book={book} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default MySoldBooks;