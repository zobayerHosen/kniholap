'use client'

import { books } from "@/data";
import BookCard from "../BookCard";
import CustomPagination from "../common/CustomPagination";
import SectionTitle from "../common/SectionTitle"
import { axiosPrivateClient } from "@/lib/axios.private.client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import BookCardSkeleton from "../BookCardSkeleton";
import ErrorState from "../common/ErrorState";
import EmptyState from "../common/EmptyState.";

const SimilarYouEnjoyed = () => {
    const axiosInstance = axiosPrivateClient();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10)

    // Note: get all data
    const { data: similarBooks, isLoading, isFetching, isError } = useQuery({
        queryKey: ["also-like", page, perPage],
        queryFn: async () => {
            const respnse = await axiosInstance.get(`/auth/similar/book/list?page=${page}&$per_page=${perPage}`);
            return respnse?.data?.data || {};
        },
        keepPreviousData: true
    });
    const pagination = similarBooks?.pagination || {};

    const handlePageClick = (pageNumber, pageSize) => {
        setPage(pageNumber);
        setPerPage(pageSize);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Note: main ui component
    return (
        <div className="w-full flex flex-col gap-3 lg:gap-6 justify-start">
            <SectionTitle text="Similar to books you’ve enjoyed" />


            {/* Loading */}
            {(isLoading || isFetching) ? (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: perPage }).map((_, i) => (
                        <BookCardSkeleton key={i} />
                    ))}
                </div>
            ) : isError ? (
                <ErrorState />
            ) : similarBooks?.books?.length === 0 ? (
                <EmptyState
                    className="py-20"
                    description="No books found with these filters or no books available"
                />
            ) : (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {similarBooks?.books?.map((book) => (
                        <BookCard book={book} key={book.id} />
                    ))}
                </div>
            )}
            <CustomPagination
                handlePageClick={handlePageClick}
                perPage={pagination?.per_page}
                totalItem={pagination?.total}
                currentPage={page}
                className=""
                showSizeChanger={true}
            />
        </div>
    )
}
export default SimilarYouEnjoyed;