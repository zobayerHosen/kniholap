"use client";
import { useState } from "react";
import SectionTitle from "../common/SectionTitle";
import BookCard from "../BookCard";
import Link from "next/link";
import Category from "../library/Category";
import useBooks from "@/hooks/books.hook";
import EmptyState from "../common/EmptyState.";
import ErrorState from "../common/ErrorState";
import BookCardSkeleton from "../BookCardSkeleton";

const LibrarySection = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(8);
    // for book_list filters
    const [filters, setFilters] = useState({
        search: null,
        type: null,
        category_ids: null,
        language_id: null,
    });
    // query data
    const {
        books,
        pagination,
        isLoading,
        isFetching,
        isError,
    } = useBooks({ filters, currentPage, perPage });

    // main render
    return (
        <section id="library" className="container flex flex-col gap-6 justify-start">
            {/* title and button */}
            <div className="w-full flex  gap-3 justify-between items-center">
                <SectionTitle text="Library Section" />
                <Link className="text-xl underline" href="/library">
                    View All
                </Link>
            </div>
            {/* filters */}
            <Category setFilters={setFilters} filters={filters} />
            {/* books grid */}
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
        </section>
    );
};

export default LibrarySection;
