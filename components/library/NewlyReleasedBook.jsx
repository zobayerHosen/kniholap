"use client"

import { books } from "@/data";
import CustomPagination from "../common/CustomPagination"
import SectionTitle from "../common/SectionTitle"
import BookCard from "../BookCard";
import useBooks from "@/hooks/books.hook";
import { useState } from "react";
import ErrorState from "../common/ErrorState";
import EmptyState from "../common/EmptyState.";
import BookCardSkeleton from "../BookCardSkeleton";

const NewlyReleasedBook = () => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const { books, pagination, isLoading, isFetching, isError } = useBooks({
        currentPage: page,
        perPage,
        orderBy: "desc",
    });

    const handlePageClick = (pageNumber, pageSize) => {
        setPage(pageNumber);
        setPerPage(pageSize);
    };

    // Note: main ui
    return (
        <div className="w-full flex flex-col gap-6 justify-start">
            <SectionTitle text="Newly Released" />
            {/* Loading */}
            {(isLoading || isFetching) ? (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: perPage }).map((_, i) => (
                        <BookCardSkeleton key={i} />
                    ))}
                </div>
            ) : isError ? (
                <ErrorState />
            ) : books?.length === 0 ? (
                <EmptyState
                    className="py-20"
                    description="No books found with these filters or no books available"
                />
            ) : (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {books?.map((book) => (
                        <BookCard book={book} key={book.id} />
                    ))}
                </div>
            )}
            <CustomPagination
                handlePageClick={handlePageClick}
                perPage={pagination.per_page}
                totalItem={pagination.total}
                currentPage={page}
                showSizeChanger={true}
            />
        </div>
    )
};
export default NewlyReleasedBook;