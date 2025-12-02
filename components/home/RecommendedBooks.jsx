"use client";
import SectionTitle from "../common/SectionTitle";
import RecommendedBookCard from "../RecommendedBookCard";
import { useQuery } from "@tanstack/react-query";
import { axiosPrivateClient } from "@/lib/axios.private.client";
import RecommendedBookCardSkeleton from "./RecommendedBookCardSkeleton";

const RecommendedBooks = () => {
    const axiosInstance = axiosPrivateClient();

    const { data: getAllRecommendedBooks, isLoading, isError } = useQuery({
        queryKey: ["getAllRecommendedBooks"],
        queryFn: async () => {
            const response = await axiosInstance.get(`/recommended/book/list`);
            return response?.data?.data || [];
        }
    });

    return (
        <section className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-20">
            {/* First book section */}
            <div className="w-full sm:col-span-2 flex flex-col gap-4 lg:gap-10">
                <SectionTitle text="Recommended for you" />
                {isLoading ? (
                    <RecommendedBookCardSkeleton />
                ) : isError ? (
                    <p className="w-full text-center text-2xl font-medium pt-8">Error loading featured book</p>
                ) : !getAllRecommendedBooks?.[0] ? (
                    <p>No featured book available</p>
                ) : (
                    <RecommendedBookCard
                        book={getAllRecommendedBooks[0]}
                        isFirstBook={true}
                    />
                )}
            </div>

            {/* Other books section */}
            {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <RecommendedBookCardSkeleton key={i} />
                ))
            ) : isError ? (
                <div className="col-span-2 lg:col-span-3 xl:col-span-4">
                    <p>Error loading other books</p>
                </div>
            ) : getAllRecommendedBooks?.length <= 1 ? (
                <div className="col-span-2 lg:col-span-3 xl:col-span-4">
                    <p>No additional books available</p>
                </div>
            ) : (
                getAllRecommendedBooks.slice(1).map((book) => (
                    <RecommendedBookCard
                        key={book.id}
                        book={book}
                        isFirstBook={false}
                    />
                ))
            )}
        </section>
    );
};
export default RecommendedBooks;