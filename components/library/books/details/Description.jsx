"use client";

import { useEffect, useState, useRef } from "react";

const Description = ({ book = {} }) => {
    const [sanitizedHTML, setSanitizedHTML] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [shouldShowButton, setShouldShowButton] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        // Reset expanded state when book changes
        setIsExpanded(false);

        // Only runs in the browser if DOM exists
        import("dompurify")
            .then((DOMPurify) => {
                if (book?.description) {
                    setSanitizedHTML(DOMPurify.default.sanitize(book.description));
                }
            })
            .catch(() => setSanitizedHTML(book?.description || ""));
    }, [book?.description, book?.id]);

    useEffect(() => {
        const checkTruncation = () => {
            if (contentRef.current) {
                const { scrollHeight, clientHeight } = contentRef.current;
                // If scrollHeight is greater than clientHeight, it means content is truncated
                // We only need to check this when not expanded to determine if we should show the button
                if (!isExpanded) {
                    setShouldShowButton(scrollHeight > clientHeight);
                }
            }
        };

        // Small timeout to ensure DOM has rendered
        const timeoutId = setTimeout(checkTruncation, 100);
        window.addEventListener("resize", checkTruncation);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener("resize", checkTruncation);
        };
    }, [sanitizedHTML, isExpanded]);

    if (!book?.description) {
        return (
            <div className="flex flex-col gap-1 sm:gap-2">
                <p className="text-lg sm:text-xl font-bold">Book Description</p>
                <p className="text-justify text-sm sm:text-base xl:text-xl text-gray-700 italic">
                    No description available
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1 sm:gap-2">
            <p className="text-lg sm:text-xl font-bold">Book Description</p>
            <div className="relative flex flex-col items-start">
                <div
                    ref={contentRef}
                    className={`text-justify text-sm sm:text-base xl:text-xl text-gray-700 prose prose-sm sm:prose-base max-w-none transition-all duration-300 ${!isExpanded ? "line-clamp-2" : ""
                        }`}
                    dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
                />

                {(shouldShowButton || isExpanded) && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="cursor-pointer mt-1 text-primary hover:text-primary/80 font-bold text-sm sm:text-base transition-all duration-200 flex items-center gap-1 underline underline-offset-4"
                    >
                        {isExpanded ? "See Less" : "See More"}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                        >
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Description;