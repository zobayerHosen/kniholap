'use client'
import BookCard from "../BookCard";
import CustomPagination from "../common/CustomPagination";
import SectionTitle from "../common/SectionTitle"
import { useQuery } from "@tanstack/react-query";
import { axiosPrivateClient } from "@/lib/axios.private.client";
import { useState } from "react";
import ErrorState from "../common/ErrorState";
import EmptyState from "../common/EmptyState.";
import BookCardSkeleton from "../BookCardSkeleton";

const YouMayLike = () => {
    const axiosInstance = axiosPrivateClient();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    // Note: get all data
    const { data: getLikeData, isLoading, isError, isFetching } = useQuery({
        queryKey: ["also-like", page, perPage],
        queryFn: async () => {
            const respnse = await axiosInstance.get(`/like/book/list?page=${page}&per_page=${perPage}`);
            return respnse?.data?.data || {}
        }
    });
    const pagination = getLikeData?.pagination;

    const handlePageClick = (pageNumber, pageSize) => {
        setPage(pageNumber);
        setPerPage(pageSize);
        // window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="w-full flex flex-col gap-6 justify-start">
            <SectionTitle text="You May also Like" />
            {/* Loading */}
            {(isLoading || isFetching) ? (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: perPage }).map((_, i) => (
                        <BookCardSkeleton key={i} />
                    ))}
                </div>
            ) : isError ? (
                <ErrorState />
            ) : getLikeData?.books?.length === 0 ? (
                <EmptyState
                    className="py-20"
                    description="No books found with these filters or no books available"
                />
            ) : (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {getLikeData?.books?.map((book) => (
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
};
export default YouMayLike;