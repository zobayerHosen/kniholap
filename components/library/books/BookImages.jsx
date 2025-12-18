'use client'
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Thumbs } from "swiper/modules";
import { useState } from "react";
import Image from "next/image";
import dummyImage from "@/public/dummyImage.png"

const BookImages = ({ book = {} }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    const images =
        book?.book_images?.filter(img => img?.image_url)?.length > 0
            ? book.book_images
            : [{ image_url: dummyImage.src }];

    // Note: main ui component
    return (
        <div className="w-full flex flex-col gap-3">
            <Swiper
                modules={[Pagination, Thumbs]}
                navigation
                pagination={{ clickable: true, dynamicBullets: true }}
                loop
                thumbs={{ swiper: thumbsSwiper }}
                className="rounded-lg border border-primary  h-60 xs:h-72 sm:h-96 md:h-72 lg:h-[350px] xl:h-[450px] w-full overflow-hidden"
            >
                {images?.map((img, index) => (
                    <SwiperSlide key={index} className="h-full w-full overflow-hidden">
                        <Image
                            priority
                            width={500}
                            height={500}
                            src={img.image_url || dummyImage}
                            alt={"book"}
                            className="w-full  h-full object-cover"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
            {/* 🖼 THUMBNAIL SWIPER */}
            <Swiper
                modules={[Thumbs]}
                onSwiper={setThumbsSwiper}
                slidesPerView={4}
                spaceBetween={10}
                loop
                watchSlidesProgress
                breakpoints={{
                    640: {
                        slidesPerView: 6,
                    },
                }}
                className=" w-full !py-1 lg:!py-4 thumbSwiper "
            >
                {images?.map((img, index) => (
                    <SwiperSlide key={index} className="h-24 w-full lg:rounded-lg rounded  cursor-pointer">
                        <Image priority width={96} height={96} src={img.image_url || dummyImage} alt="thumb" className="w-full h-24 lg:rounded-lg rounded object-cover" />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default BookImages