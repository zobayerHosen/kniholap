'use client'
import { FaCrown, FaRegBookmark, FaBookmark } from "react-icons/fa6";
import StarRating from "./common/StarRating";
import CommonBtn from "./common/CommonBtn";
import Image from "next/image";
import useBookMarks from "@/hooks/bookmarks.hook";
import { useState } from "react";
import dummyImage from "@/public/dummyImage.png"
import DOMPurify from 'dompurify';
import Cookies from "js-cookie";
import AuthRequiredModal from "./common/AuthRequiredModal";

const RecommendedBookCard = ({ book = {}, isFirstBook = false }) => {
    const [showAuthModal, setShowAuthModal] = useState();
    const { handleBookMarksMutation } = useBookMarks();

    // Note: destructuring all data
    const {
        id,
        title,
        author,
        cover_image,
        rating,
        description,
        category = {},
        is_bookmarked,
        subcategories = [],
        type
    } = book || {};
    const [isBookMarked, setIsBookMarked] = useState(is_bookmarked);

    const descriptionSanitized = DOMPurify.sanitize(description)

    // Note: convert cover image to null if this empty image
    const src = cover_image ? cover_image : null
    const [imageURL, setImageURL] = useState(src || dummyImage);

    const handleBookmark = () => {
        const token = Cookies.get(
            process.env.AUTH_TOKEN_NAME || "kniholap_auth_token"
        );
        // Note: token check
        if (!token) {
            setShowAuthModal(true);
            return;
        };
        handleBookMarksMutation.mutate({ book_id: id });
        setIsBookMarked((prev) => !prev);
    };
    // Note: main render
    return (
        <>
            {
                isFirstBook ? (
                    <div className="bg-secondary-rgb p-4 rounded-xl h-full flex sm:flex-row flex-col md:gap-4 gap-3">
                        {/* book cover */}
                        <div className="sm:w-1/2 w-full relative flex rounded-xl overflow-hidden justify-center h-48  sm:h-full">
                            {src ? (
                                <Image
                                    src={imageURL}
                                    alt={title}
                                    className="w-full h-full object-cover"
                                    width={480}
                                    height={480}
                                    onError={() => setImageURL(dummyImage)}
                                />
                            ) : (
                                <div className="w-full h-full bg-white flex items-center justify-center">
                                    <span>No Cover Image</span>
                                </div>
                            )}
                            <div className="max-w-[90%] w-full text-2xl flex items-center justify-between gap-1 z-10 absolute bottom-5">
                                {category.name === "Premium" && (
                                    <FaCrown className="text-2xl text-yellow-500" />
                                )}
                                <button
                                    className="self-end cursor-pointer"
                                    type="button"
                                    onClick={handleBookmark}
                                >
                                    {isBookMarked ? (
                                        <FaBookmark className="text-yellow-500" />
                                    ) : (
                                        <FaRegBookmark className="" />
                                    )}
                                </button>
                            </div>
                        </div>
                        {/* book details */}
                        <div className="sm:w-1/2 w-full flex flex-col sm:h-full gap-2 sm:gap-3 md:gap-4">
                            <h3 className="md:text-2xl sm:text-xl text-lg font-medium">{title}</h3>
                            <p className="sm:text-lg text-base">Author: {author}</p>
                            <div className="w-full flex items-center justify-between gap-1">
                                <StarRating rating={rating} />
                                <span className="font-medium text-sm sm:text-xl">{Number(rating).toFixed(1)}</span>
                            </div>
                            <p className="sm:text-base text-sm sm:h-full line-clamp-3 md:line-clamp-8" dangerouslySetInnerHTML={{ __html: descriptionSanitized }} />
                            {/* <div dangerouslySetInnerHTML={{__html: descriptionSanitized}}/> */}
                            <div className="w-full flex  flex-wrap gap-2">
                                {subcategories.map((category) => (
                                    <span className="border flex sm:text-base text-xs capitalize font-medium justify-center items-center px-2 sm:px-5 py-1 sm:py-2 rounded-full" key={category.id}>
                                        {category.name}
                                    </span>
                                ))}
                            </div>
                            {
                                type === "ebook" ? (
                                    <CommonBtn className={`rounded-full bg-black text-white capitalize`} link={true} path={`/library/book/${book?.slug}/read`}>
                                        Read Now
                                    </CommonBtn>
                                ) : (
                                    <CommonBtn className={`rounded-full bg-black text-white capitalize`} link={true} path={`/library/book/${book?.slug}`}>
                                        Details
                                    </CommonBtn>
                                )
                            }
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex gap-4 flex-col justify-start bg-secondary-rgb p-4 rounded-xl">
                        {/* book cover */}
                        <div className="w-full shadow-md rounded-2xl overflow-hidden h-48 sm:h-60 shrink-0 relative flex justify-center -mt-16">
                            {src ? (
                                <Image
                                    src={imageURL}
                                    alt={title}
                                    className="w-full h-full object-cover"
                                    width={480}
                                    height={480}
                                    onError={() => setImageURL(dummyImage)}
                                />
                            ) : (
                                <div className="w-full h-full bg-white flex items-center justify-center">
                                    <span>No Cover Image</span>
                                </div>
                            )}
                            <div className="max-w-[90%] w-full text-2xl flex items-center justify-between gap-1 z-10 absolute bottom-5">
                                {category.name === "Premium" && (
                                    <FaCrown className="text-2xl text-yellow-500" />
                                )}
                                <button
                                    className="self-end cursor-pointer"
                                    type="button"
                                    onClick={handleBookmark}
                                >
                                    {isBookMarked ? (
                                        <FaBookmark className="text-yellow-500" />
                                    ) : (
                                        <FaRegBookmark className="" />
                                    )}
                                </button>
                            </div>
                        </div>
                        {/* book details */}
                        <div className="w-full flex flex-col justify-between h-full gap-2">
                            <h3 className="md:text-2xl sm:text-xl text-lg font-medium">{title}</h3>
                            <p className="sm:text-lg text-base">Author: {author}</p>
                            <div className="w-full flex items-center justify-between gap-1">
                                <StarRating rating={rating} />
                                <span className="font-medium text-sm sm:text-xl">{Number(rating).toFixed(1)}</span>
                            </div>
                            {/* <p className="sm:text-base text-sm line-clamp-3">{description}</p> */}
                            <p className="sm:text-base text-sm line-clamp-3" dangerouslySetInnerHTML={{ __html: descriptionSanitized }} />

                            <div className="w-full flex  flex-wrap gap-2">
                                {subcategories.map((category, index) => (
                                    <span className="border flex sm:text-base text-xs capitalize font-medium justify-center items-center px-2 sm:px-5 py-1 sm:py-2 rounded-full" key={category.id}>
                                        {category.name}
                                    </span>
                                ))}
                            </div>
                            {
                                type === "ebook" ? (
                                    <CommonBtn className={`rounded-full bg-black text-white capitalize`} link={true} path={`/library/book/${book?.slug}/read`}>
                                        Read Now
                                    </CommonBtn>
                                ) : (
                                    <CommonBtn className={`rounded-full bg-black text-white capitalize`} link={true} path={`/library/book/${book?.slug}`}>
                                        Details
                                    </CommonBtn>
                                )
                            }
                        </div>
                    </div>
                )
            }
            <AuthRequiredModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                text="You need to sign in first to bookmark this book."
                buttonText="Go to Sign In"
            />
        </>
    )
};
export default RecommendedBookCard;