'use client';
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import BookCard from "../BookCard";
import { useQuery } from "@tanstack/react-query";
import { axiosPrivateClient } from "@/lib/axios.private.client";
const BookMarkList = () => {
    const axiosInstance = axiosPrivateClient();

    // Note: get all book mark list data
    const { data: getBookmarksList, isLoading } = useQuery({
        queryKey: ["getBookmarksList"],
        queryFn: async () => {
            const response = await axiosInstance.get(`/auth/wishlist/list`);
            return response?.data?.data || [];
        }
    });

    // Note: main ui component
    return (
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
                }
            }}
            className="w-full lg:mb-10 !px-1"
            autoplay={{ delay: 2500, disableOnInteraction: false }}
        >
            {getBookmarksList?.map((book, idx) => (
                <SwiperSlide className="w-full" key={idx}>
                    <BookCard layout="bookmark" book={book} />
                </SwiperSlide>
            ))}
        </Swiper>
    )
};
export default BookMarkList;