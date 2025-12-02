'use client'

import BookCard from "@/components/BookCard";
import CustomPagination from "@/components/common/CustomPagination";
import SectionTitle from "@/components/common/SectionTitle";
import { axiosPrivateClient } from "@/lib/axios.private.client";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const RelatedBooks = ({ book }) => {
    const axiosInstance = axiosPrivateClient();

    // Note: convert category_ids to string
    const categoryString = useMemo(() => {
        if (!book?.category_ids) return "";

        try {
            const parsed = JSON.parse(book.category_ids);
            if (Array.isArray(parsed)) {
                 return parsed.join(",");
            }
        } catch (error) {
            console.error("Failed to parse category_ids:", error);
        }

        return "";
    }, [book?.category_ids]);

    // Note: get related books
    const { data: relatedBooks = [], isLoading, isError } = useQuery({
        queryKey: ["relatedBooks", categoryString],
        queryFn: async () => {
            if (!categoryString) return [];

            const response = await axiosInstance.get(`/related/book/list/${categoryString}`);
            return response?.data?.data || [];
        },
        enabled: !!categoryString,
    });
    console.log("Get related books:--->", relatedBooks)

    const handlePageClick = (page) => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (isLoading) {
        return <div>Loading related books...</div>;
    }

    if (isError || !categoryString) {
        return <p className="w-full text-center font-medium text-2xl">No related books found</p>
    }

    return (
        <div className="w-full flex flex-col gap-3 md:gap-6 justify-start">
            <SectionTitle className="text-2xl font-secondary" text="Related Books" />

            {relatedBooks.length === 0 ? (
                <p className="text-gray-500 py-8 text-center col-span-full">
                    No related books found
                </p>
            ) : (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {relatedBooks.map((relatedBook) => (
                        <BookCard book={relatedBook} key={relatedBook.id} />
                    ))}
                </div>
            )}

            {/* pagination*/}
            <CustomPagination
                handlePageClick={handlePageClick}
                perPage={10}
                totalItem={relatedBooks.length}
                currentPage={1}
            />
        </div>
    );
};
export default RelatedBooks;