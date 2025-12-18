'use client';

import Marquee from "react-fast-marquee";
import SectionTitle from "../common/SectionTitle";
import Image from "next/image";
import { useOptions } from "@/hooks/options.hook";
import EmptyState from "../common/EmptyState.";
import ErrorState from "../common/ErrorState";
import { useState } from "react";
import dummyImage from "@/public/dummyImage.png"

const BookCategories = () => {
    const { categoryList, categoryListError, categoryListLoading } = useOptions();

    const [imageURL, setImageURL] = useState(categoryList?.image || dummyImage)

    // Skeleton Card Component
    const CategorySkeleton = () => (
        <div className="relative rounded-3xl w-56 md:w-72 lg:w-96 h-56 md:h-64 mx-3 bg-gray-100 animate-pulse">
            {/* Badge Skeleton */}
            <div className="absolute -top-4 left-5 bg-gray-300 h-8 md:h-10 w-32 md:w-44 rounded-2xl"></div>
            {/* Image Skeleton */}
            <div className="w-full h-full rounded-3xl bg-gray-200"></div>
        </div>
    );

    // Note: main UI component
    return (
        <section className="w-full flex flex-col items-center justify-start py-10">
            <SectionTitle text="Available Book Category" />

            <div className="relative w-full mt-8">
                <Marquee
                    speed={50}
                    pauseOnHover
                    gradient={true}
                    gradientWidth={50}
                    gradientColor="#f5f5f9"
                    direction="left"
                    className="md:min-h-[400px] min-h-[310px]"
                >
                    {categoryListLoading ? (
                        // Show 6 skeleton cards while loading
                        <>
                            {[...Array(6)].map((_, i) => (
                                <CategorySkeleton key={i} />
                            ))}
                        </>
                    ) : categoryListError ? (
                        <div className="w-full flex justify-center">
                            <ErrorState />
                        </div>
                    ) : !categoryList || categoryList.length === 0 ? (
                        <div className="w-full flex justify-center py-20">
                            <EmptyState description="No book category available yet." />
                        </div>
                    ) : (
                        // Real Data — Now using actual categoryList
                        categoryList.map((category) => (
                            <div
                                key={category.id}
                                className="relative rounded-3xl w-56 md:w-72 lg:w-96 h-56 md:h-64 mx-3 group cursor-pointer"
                            >
                                {/* Category Badge */}
                                <div className="absolute line-clamp-1 md:ring-4 ring-2 md:py-3 py-1 md:px-8 px-4 text-lg md:text-xl text-center ring-white -top-4 left-5 bg-black text-white rounded-2xl font-medium z-10 transition-all group-hover:bg-gray-800">
                                    {category.title || "Category"}
                                </div>

                                {/* Cover Image - You can use a placeholder or featured book cover */}
                                <div className="w-full h-full rounded-3xl overflow-hidden shadow-lg">
                                    <Image
                                        src={imageURL}
                                        alt={category.title || "Category"}
                                        width={400}
                                        height={500}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={() => setImageURL(dummyImage)}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </Marquee>
            </div>
        </section>
    );
};

export default BookCategories;