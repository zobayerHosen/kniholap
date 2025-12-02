"use client";
import StarRating from "./common/StarRating"
import CommonBtn from "./common/CommonBtn"
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { useState } from "react";
import dummyImage from "@/public/dummyImage.png"
import useBookMarks from "@/hooks/bookmarks.hook";
const BookCard = ({ book = {}, layout }) => {
    const { handleBookMarksMutation } = useBookMarks();

    // Note: destructure all properties
    const {
        id,
        slug,
        author,
        cover_image,
        images = [],
        title,
        type,
        description,
        is_premium,
        is_bookmarked,
        published_at,
        no_of_reviews,
        rating,
        categories = [],
        isbn
    } = book || {}
    const [imgSrc, setImgSrc] = useState(cover_image || dummyImage);
    const [isBookmarked, setIsBookmarked] = useState(is_bookmarked);
    const handleBookmark = () => {
        handleBookMarksMutation.mutate({ book_id: id });
        setIsBookmarked(!isBookmarked);
    };
    if (layout === "bookmark") {
        return (
            <div className="w-full p-4 md:p-6 rounded-3xl border flex sm:flex-row flex-col justify-start gap-4 md:gap-8 border-black/20">
                <div className="lg:w-96 sm:w-[250px] h-[250px] lg:h-96 shrink-0 rounded-lg overflow-hidden">
                    <img src={imgSrc} alt={title} className="w-full h-full object-cover hover:scale-110 transition-all ease-in-out duration-500"
                        onError={() => setImgSrc(dummyImage.src)}
                    />
                </div>
                <div className="w-full flex flex-col gap-2 lg:gap-4">
                    <p className="lg:text-3xl text-lg md:text-xl font-medium ">{title} </p>
                    <p><span className="lg:text-xl text-base font-medium">Author:</span> <b className="text-[#A27B5C]">{author || "Unknown"}</b></p>
                    <div className="w-full text-xl md:flex-row flex-col-reverse flex items-center justify-start gap-2 lg:gap-5">
                        <StarRating rating={rating} value={rating} className="text-sm self-start" />
                        <p className="font-medium line-clamp-1 self-start md:text-base text-xs sm:text-sm">
                            <span>{Number(rating).toFixed(1)} </span>
                            <span>Reviews:</span> ({no_of_reviews} reviews)
                        </p>
                        {/* bookmark toggle */}
                        <button
                            className="shrink-0 self-end size-8 lg:size-10 flex items-center justify-center p-1 bg-[#D9D9D9] rounded-sm cursor-pointer"
                            type="button"
                            onClick={handleBookmark}
                        >
                            {isBookmarked ? (
                                <FaBookmark className="text-dark" />
                            ) : (
                                <FaRegBookmark />
                            )}
                        </button>
                    </div>
                    <div className="w-full h-full">
                        <p className="md:text-base text-sm line-clamp-2 md:line-clamp-3 lg:line-clamp-6">{description}</p>
                    </div>
                    <CommonBtn
                        className={`rounded-full !min-h-auto !h-[48px]`}
                        link={true}
                        path={`${type === 'ebook' ? `/library/book/${slug}/read` : `/library/book/${id}`}`}
                    >
                        {type === 'ebook' ? 'Continue reading' : 'Buy Now'}
                    </CommonBtn>
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
                <p><span className="md:text-xl text-base sm:text-lg font-medium">Author:</span> {author}</p>
                <div className="w-full text-sm md:text-base flex items-center justify-between gap-1">
                    <StarRating rating={rating} />
                    <span>{Number(rating).toFixed(1)}</span>
                </div>
                <p className="text-sm md:text-base">Reviews: ({no_of_reviews} reviews)</p>
            </div>
            <CommonBtn className={`!h-[50px] min-h-auto`} link={true} path={`${type === 'ebook' ? `/library/book/${slug}/read` : `/library/book/${slug}`}`}>
                View more
            </CommonBtn>
        </div>
    )
};
export default BookCard;