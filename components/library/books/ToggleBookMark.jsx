'use client'
import useBookMarks from "@/hooks/bookmarks.hook";
import { useState } from "react";
import { FaBookmark } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
const ToggleBookMark = ({ book = {} }) => {
    const { handleBookMarksMutation } = useBookMarks();
    const [isBookmark, setIsBookmark] = useState(book.is_bookmarked);

    const handleBookMark = () => {
        handleBookMarksMutation.mutate({ book_id: book.id });
        setIsBookmark((prev) => !prev);
    };

    // Note: main render button
    return (
        <button
            onClick={handleBookMark}
            className="lg:size-12 size-8 cursor-pointer bg-secondary text-white rounded shrink-0 flex text-lg justify-center items-center p-1"
        >
            {isBookmark ? (
                <FaBookmark className="text-yellow-500" />
            ) : (
                <FaRegBookmark />
            )}
        </button>
    );
};
export default ToggleBookMark;