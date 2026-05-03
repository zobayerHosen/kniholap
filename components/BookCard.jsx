"use client";
import StarRating from "./common/StarRating"
import CommonBtn from "./common/CommonBtn"
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { useState } from "react";
import dummyImage from "@/public/dummyImage.png"
import useBookMarks from "@/hooks/bookmarks.hook";
import DOMPurify from "isomorphic-dompurify";
import useCheckout from "@/hooks/checkout.hook";
import CheckoutButton from "./library/books/details/CheckoutButton";
import Link from "next/link";
const BookCard = ({ book = {}, layout }) => {
    const { handleBookMarksMutation } = useBookMarks();
    // const { handleCheckoutMutation, isError, setIsError } = useCheckout()

    // Note: handle nested book object for wishlist/bookmark list
    const bookData = book?.book || book || {};

    // Note: destructure all properties
    const {
        id,
        slug,
        author,
        author_name,
        language,
        cover_image,
        title,
        type,
        description,
        is_bookmarked,
        no_of_reviews,
        is_already_purchase,
        total_sales,
        rating
    } = bookData || {};

    const [imgSrc, setImgSrc] = useState(cover_image || dummyImage);
    const [isBookmarked, setIsBookmarked] = useState(is_bookmarked);
    const descriptionSanitized = DOMPurify.sanitize(description || "")
    const handleBookmark = () => {
        handleBookMarksMutation.mutate({ book_id: id });
        setIsBookmarked(!isBookmarked);
    };
    if (layout === "bookmark") {
        return (
            <div className="group w-full p-4 md:p-8 rounded-[2rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/40 flex sm:flex-row flex-col justify-start gap-6 md:gap-10 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-300/40 border-b-4 border-b-primary/10">
                <div className="lg:w-80 sm:w-[220px] h-[250px] lg:h-96 shrink-0 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500">
                    <img
                        src={imgSrc || dummyImage}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        onError={() => setImgSrc(dummyImage.src)}
                    />
                </div>
                <div className="w-full flex flex-col gap-3 lg:gap-5">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex flex-col gap-1">
                            <p className="lg:text-4xl text-2xl md:text-3xl font-bold font-secondary text-gray-800 hover:text-primary transition-colors line-clamp-1">
                                {title}
                            </p>
                            <p className="flex items-center gap-2 text-sm lg:text-lg">
                                <span className="text-gray-500 font-medium">By</span>
                                <span className="text-primary font-bold hover:underline cursor-pointer">{author || author_name || "Unknown"}</span>
                            </p>
                        </div>

                        {/* bookmark toggle */}
                        <button
                            className={`shrink-0 size-10 lg:size-12 flex items-center justify-center rounded-xl cursor-pointer transition-all duration-300 ${isBookmarked ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'}`}
                            type="button"
                            onClick={handleBookmark}
                        >
                            {isBookmarked ? (
                                <FaBookmark className="size-5" />
                            ) : (
                                <FaRegBookmark className="size-5" />
                            )}
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm lg:text-base">
                        <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                            <span className="font-semibold text-gray-500 mr-2">Language:</span>
                            <span className="text-gray-800 font-bold">{language || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <StarRating rating={rating} value={rating} className="text-sm" />
                            <p className="font-bold text-gray-700">
                                {Number(rating).toFixed(1)}
                                <span className="text-gray-400 font-medium ml-1">({no_of_reviews} reviews)</span>
                            </p>
                        </div>
                    </div>

                    <div className="w-full">
                        <div
                            className="text-gray-600 leading-relaxed md:text-base text-sm line-clamp-2 md:line-clamp-3 lg:line-clamp-4 prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: descriptionSanitized }}
                        />
                    </div>

                    <div className="mt-auto pt-4 flex items-center gap-4">
                        <CheckoutButton book={bookData} />
                    </div>
                </div>
            </div>
        )
    }
    // Note: default layout
    return (
        <div className="w-full p-4 md:p-6 rounded-3xl border flex flex-col justify-start gap-4 border-black/20">
            <div className="w-full h-52 xs:h-56 sm:h-60 rounded-lg overflow-hidden">
                <img
                    src={imgSrc}
                    alt={title}
                    className="w-full h-full object-cover hover:scale-110 transition-all ease-in-out duration-500"
                    onError={() => setImgSrc(dummyImage.src)}
                />
            </div>
            <div className="w-full flex flex-col gap-1">
                <p className="sm:text-xl text-lg md:text-2xl font-medium line-clamp-1">{title}</p>
                <p><span className="md:text-xl text-base sm:text-lg font-medium">Author:</span> {author || author_name || "Unknown"}</p>
                <p><span className="lg:text-xl text-base font-medium">Language:</span> <b className="text-[#A27B5C]">{language || "N/A"}</b></p>
                <div className="w-full text-sm md:text-base flex items-center justify-between gap-1">
                    <StarRating rating={rating} />
                    <span>{Number(rating).toFixed(1)}</span>
                </div>
                <p className="text-sm md:text-base">Reviews: ({no_of_reviews} reviews)</p>
                <p>Total Sales: {total_sales || "0"}</p>
            </div>

            <CommonBtn
                className={`rounded-full !min-h-auto !h-[48px] ${is_already_purchase && "bg-blue-400"}`}
                link={true}
                path={type === 'ebook' && is_already_purchase ? "/download-app" : `/library/book/${slug}`}
            >
                {type === 'ebook' && is_already_purchase ? 'Read on App' : is_already_purchase ? "Already Purchased" : "View more"}
            </CommonBtn>
        </div>
    );
};
export default BookCard;