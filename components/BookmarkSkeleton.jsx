import React from 'react';

const BookmarkSkeleton = () => {
    return (
        <div className="w-full p-4 md:p-8 rounded-[2rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/40 flex sm:flex-row flex-col justify-start gap-6 md:gap-10 relative overflow-hidden">
            {/* Shimmer effect overlay */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {/* Image skeleton */}
            <div className="lg:w-80 sm:w-[220px] h-[250px] lg:h-96 shrink-0 rounded-2xl overflow-hidden bg-gray-100">
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200"></div>
            </div>

            <div className="w-full flex flex-col gap-3 lg:gap-5">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col gap-2 w-3/4">
                        {/* Title skeleton */}
                        <div className="lg:h-10 h-7 w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg"></div>
                        {/* Author skeleton */}
                        <div className="h-5 w-1/2 bg-gray-100 rounded-md"></div>
                    </div>

                    {/* Bookmark button skeleton */}
                    <div className="shrink-0 size-10 lg:size-12 bg-gray-100 rounded-xl"></div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="h-8 w-32 bg-gray-50 rounded-full border border-gray-100"></div>
                    <div className="h-6 w-40 bg-gray-100 rounded-md"></div>
                </div>

                {/* Description skeleton - multi-line */}
                <div className="w-full space-y-2 mt-2">
                    <div className="h-4 w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-md"></div>
                    <div className="h-4 w-11/12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-md"></div>
                    <div className="h-4 w-4/5 bg-gradient-to-r from-gray-100 to-gray-200 rounded-md"></div>
                </div>

                {/* Button skeleton */}
                <div className="mt-auto pt-4">
                    <div className="rounded-full h-[48px] w-48 bg-gradient-to-r from-gray-100 to-gray-200"></div>
                </div>
            </div>
        </div>
    );
};
export default BookmarkSkeleton;