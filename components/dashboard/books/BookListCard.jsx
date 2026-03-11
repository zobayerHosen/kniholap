"use client";

import StarRating from "@/components/common/StarRating";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import BookRemoveModal from "./BookRemoveModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosPrivateClient } from "@/lib/axios.private.client";

const BookListCard = ({ book }) => {
    const [isOpen, setIsOpen] = useState(false);
    const axiosInstance = axiosPrivateClient();
    const queryClient = useQueryClient();

    // Note: extract book properties
    const {
        id,
        title,
        author,
        category_ids,
        isbn,
        description,
        cover_image,
        type,
        is_premium,
        is_subscription_only,
        preview_pages,
        total_pages,
        price,
        discount_price,
        stock,
        condition,
        weight_gram,
        dimensions,
        pdf_file,
        status,
        published_at,
        view_count,
        download_count,
        rating_avg,
        rating_count,
        book_categories
    } = book;

    // Note: book deleted mutation success handler
    const handleBookDeleteMutation = useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.delete(`/auth/seller/book/delete/${id}`);
            return response?.data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Book removed successfully")
            queryClient.invalidateQueries({ queryKey: ["gettAllBooksListData"], exact: true });
            closeRemoveModal();
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Failed to remove the book. Please try again.");
        }
    });

    // Note: handle book remove 
    const handleBookRemove = () => {
        handleBookDeleteMutation.mutate();
    }

    // Parse category IDs from string to array
    const parsedCategoryIds = category_ids ? JSON.parse(category_ids) : [];

    // Format price with currency
    const formattedPrice = price ? `€${parseFloat(price).toFixed(2)}` : 'Free';
    const formattedDiscountPrice = discount_price ? `€${parseFloat(discount_price).toFixed(2)}` : null;

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'published':
                return 'text-[#40EA46] bg-[rgba(64,234,70,0.15)]';
            case 'draft':
                return 'text-[#FFA500] bg-[rgba(255,165,0,0.15)]';
            case 'archived':
                return 'text-[#FF4444] bg-[rgba(255,68,68,0.15)]';
            default:
                return 'text-[#6B7280] bg-[rgba(107,114,128,0.15)]';
        }
    };

    // Note: open remove modal conversion
    const openRemoveModal = () => setIsOpen(true);
    const closeRemoveModal = () => setIsOpen(false);

    // Note: main ui component
    return (
        <div className="w-full p-4 lg:p-6 shadow-lg rounded-3xl bg-white flex flex-col gap-4 lg:gap-6">
            {/* Book Header */}
            <div className="flex flex-col gap-4 lg:gap-6">
                {/* Cover Image */}
                <div className="w-full h-[200px] sm:h-[180px] lg:h-[200px] xl:h-[220px] rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center">
                    {cover_image ? (
                        <Image
                            src={cover_image}
                            alt={title}
                            width={200}
                            height={280}
                            className="w-full h-full object-cover rounded-xl"
                        />
                    ) : (
                        <div className="text-gray-400 text-center p-4">
                            <span className="text-lg">📚</span>
                            <p className="text-sm mt-2">No Cover Image</p>
                        </div>
                    )}
                </div>

                {/* Book Details */}
                <div className="flex-1 flex flex-col gap-3">
                    {/* Title and Author */}
                    <div className="w-full">
                        <h3 className="text-xl lg:text-2xl font-semibold text-[#0A0910] mb-1">
                            {title || 'Untitled Book'}
                        </h3>
                        <p className="text-sm lg:text-base text-gray-600">
                            by {author || 'Unknown Author'}
                        </p>
                    </div>

                    {/* Rating and Status */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <StarRating
                                className="text-xl"
                                rating={parseFloat(rating_avg) || 0}
                            />
                            <span className="text-lg text-[#0A0910]">
                                {parseFloat(rating_avg || 0).toFixed(1)}
                            </span>
                            <span className="text-sm text-gray-500">
                                ({rating_count || 0} reviews)
                            </span>
                        </div>
                        <p className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(status)}`}>
                            {status?.charAt(0).toUpperCase() + status?.slice(1)}
                        </p>
                    </div>

                    {/* Price Information */}
                    <div className="flex items-center gap-3">
                        {discount_price ? (
                            <>
                                <span className="text-lg font-semibold text-green-600">
                                    {formattedDiscountPrice}
                                </span>
                                <span className="text-lg text-gray-500 line-through">
                                    {formattedPrice}
                                </span>
                                <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                                    Save €{(parseFloat(price) - parseFloat(discount_price)).toFixed(2)}
                                </span>
                            </>
                        ) : (
                            <span className="text-lg font-semibold text-gray-800">
                                {formattedPrice}
                            </span>
                        )}
                    </div>

                    {/* Stock and Condition */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>Stock: {stock} units</span>
                        <span>Condition: {condition}</span>
                        {weight_gram && <span>Weight: {weight_gram}g</span>}
                    </div>
                </div>
            </div>

            {/* Additional Information */}
            <div className="text-sm text-gray-600 space-y-3">
                <p className="font-medium">ISBN: {isbn}</p>
                <p className="font-medium">Pages: {preview_pages} preview </p>
                <span className="font-medium">Published: {formatDate(published_at)}</span>
            </div>

            {/* Description */}
            {description && (
                <div className="text-sm text-gray-600">
                    <details className="cursor-pointer">
                        <summary className="font-medium">Description</summary>
                        <p className="mt-2 text-gray-700 line-clamp-3">
                            {description || 'No description available'}
                        </p>
                    </details>
                </div>
            )}

            {/* Action Buttons */}
            <div className="w-full flex flex-col sm:flex-row items-center gap-3 lg:gap-6 pt-2 border-t border-gray-200">
                <Link
                    href={`/dashboard/books/${id}`}
                    className="text-center cursor-pointer w-full sm:w-1/2 text-[#F5F5F9] text-base sm:text-sm lg:text-base bg-[#7C2709] font-medium rounded-xl py-2.5 md:py-3 hover:bg-[#6a2108] transition-colors"
                >
                    Edit Book
                </Link>
                <button
                    onClick={openRemoveModal}
                    className="cursor-pointer w-full sm:w-1/2 text-[#F5F5F9] text-base sm:text-sm lg:text-base bg-[#F84E12] font-medium rounded-xl py-2.5 md:py-3 hover:bg-[#e6450d] transition-colors"
                >
                    Remove Book
                </button>
            </div>

            <BookRemoveModal
                isModalOpen={isOpen}
                handleCancel={closeRemoveModal}
                bookTitle={title}
                handleBookRemove={handleBookRemove}
                handleBookDeleteMutation={handleBookDeleteMutation}
            />
        </div>
    );
};
export default BookListCard;