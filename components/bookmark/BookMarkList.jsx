'use client';
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import BookCard from "../BookCard";
import { useQuery } from "@tanstack/react-query";
import { axiosPrivateClient } from "@/lib/axios.private.client";
import BookmarkSkeleton from "../BookmarkSkeleton";

const BookMarkList = () => {
    const axiosInstance = axiosPrivateClient();

    const { data: getBookmarksList = [], isLoading } = useQuery({
        queryKey: ["getBookmarksList"],
        queryFn: async () => {
            const response = await axiosInstance.get(`/auth/wishlist/list`);
            return response?.data?.data || [];
        },
    });

    const isEmpty = !isLoading && getBookmarksList.length === 0;

    return (
        <div className="w-full">
            {isLoading ? (
                <div className="w-full grid grid-cols-1">
                    <BookmarkSkeleton />
                </div>
            ) : isEmpty ? (
                <div className="w-full py-12 px-4 sm:py-16 md:py-20 flex flex-col items-center justify-center text-center">
                    <div className="mb-6 text-6xl sm:text-7xl opacity-70">
                        📚✨
                    </div>

                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-400 mb-3">
                        Your bookshelf is empty
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
                        Start building your personal collection by bookmarking books you love or want to read later.
                    </p>
                </div>
            ) : (
                <Swiper
                    modules={[Autoplay]}
                    slidesPerView={1}
                    spaceBetween={20}
                    loop={true}
                    freeMode={true}
                    grabCursor={true}
                    breakpoints={{
                        640: {
                            slidesPerView: 1.1,
                        },
                        1024: {
                            slidesPerView: 1.1,
                        },
                        1280: {
                            slidesPerView: 1.2,
                        },
                    }}
                    className="w-full lg:mb-10 !px-1"
                    autoplay={{ delay: 2500, disableOnInteraction: false }}
                >
                    {getBookmarksList.map((book, idx) => (
                        <SwiperSlide className="w-full" key={idx}>
                            <BookCard layout="bookmark" book={book} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
};

export default BookMarkList;