'use client'

import useBookAllReview from "@/hooks/get-all-book-review";
import TestimonyCard from "@/components/home/TestimonyCard";
import { Loader2 } from "lucide-react";

const BookReviewsList = ({ bookId }) => {
    const { data: reviewsData, isLoading, isError } = useBookAllReview();

    if (isLoading) {
        return (
            <div className="w-full flex justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    if (isError) {
        return <div className="text-center py-20 text-red-500">Failed to load reviews.</div>;
    }

    const allReviews = reviewsData?.data || [];
    const filteredReviews = allReviews.filter(review => review.book_id === bookId);

    if (filteredReviews.length === 0) {
        return <div className="text-center py-20 text-gray-500">No reviews found for this book.</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredReviews.map((review) => (
                <TestimonyCard 
                    key={review.id} 
                    testimony={{
                        ...review,
                        name: `${review.first_name} ${review.last_name}`
                    }} 
                />
            ))}
        </div>
    );
}

export default BookReviewsList;
