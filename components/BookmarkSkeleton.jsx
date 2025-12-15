import React from 'react';

const BookmarkSkeleton = () => {
    return (
        <div className="w-full p-4 md:p-6 rounded-3xl border flex sm:flex-row flex-col justify-start gap-4 md:gap-8 border-black/20 relative overflow-hidden">
            {/* Shimmer effect overlay */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            {/* Image skeleton */}
            <div className="lg:w-96 sm:w-[250px] h-[250px] lg:h-96 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200"></div>
            </div>

            <div className="w-full flex flex-col gap-2 lg:gap-4">
                {/* Title skeleton */}
                <div className="lg:h-10 h-6 md:h-7 w-3/4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-md"></div>

                {/* Author skeleton */}
                <div className="flex items-center gap-2">
                    <div className="lg:h-6 h-4 w-16 bg-gray-100 rounded-md"></div>
                    <div className="lg:h-6 h-4 w-32 bg-gradient-to-r from-gray-100 to-gray-200 rounded-md"></div>
                </div>

                {/* Rating section skeleton */}
                <div className="w-full text-xl md:flex-row flex-col-reverse flex items-center justify-start gap-2 lg:gap-5">
                    <div className="flex gap-1 self-start">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-4 h-4 md:w-5 md:h-5 bg-gray-100 rounded-sm"></div>
                        ))}
                    </div>

                    <div className="flex gap-2 items-center self-start">
                        <div className="h-5 w-10 bg-gray-100 rounded-md"></div>
                        <div className="h-5 w-24 bg-gray-100 rounded-md"></div>
                    </div>

                    {/* Bookmark button skeleton */}
                    <div className="shrink-0 self-end size-8 lg:size-10 flex items-center justify-center p-1 bg-gray-100 rounded-sm">
                        <div className="w-4 h-4 lg:w-5 lg:h-5 bg-gray-200 rounded-sm"></div>
                    </div>
                </div>

                {/* Description skeleton - multi-line */}
                <div className="w-full h-full space-y-2">
                    <div className="md:h-4 h-3 w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-md"></div>
                    <div className="md:h-4 h-3 w-4/5 bg-gradient-to-r from-gray-100 to-gray-200 rounded-md"></div>
                    <div className="md:h-4 h-3 w-3/4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-md hidden md:block"></div>
                    <div className="md:h-4 h-3 w-2/3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-md hidden lg:block"></div>
                </div>

                {/* Button skeleton */}
                <div className="rounded-full h-[48px] w-40 bg-gradient-to-r from-gray-100 to-gray-200"></div>
            </div>
        </div>
    );
};
export default BookmarkSkeleton;