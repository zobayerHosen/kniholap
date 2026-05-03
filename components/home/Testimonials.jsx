"use client";
import Marquee from "react-fast-marquee"
import SectionTitle from "../common/SectionTitle"
import TestimonyCard from "./TestimonyCard"
import { useQuery } from "@tanstack/react-query";
import { axiosPrivateClient } from "@/lib/axios.private.client";

// const testimonials = [
//     {
//         id: 1,
//         name: "John Doe",
//         rating: 4.5,
//         avatar: "https://i.pravatar.cc/300",
//         review: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, autem?",
//     },
//     {
//         id: 2,
//         name: "John Doe",
//         rating: 4.5,
//         avatar: "https://i.pravatar.cc/300",
//         review: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, autem?",
//     },
//     {
//         id: 3,
//         name: "John Doe",
//         rating: 4.5,
//         avatar: "https://i.pravatar.cc/300",
//         review: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, autem?",
//     },
//     {
//         id: 4,
//         name: "John Doe",
//         rating: 4.5,
//         avatar: "https://i.pravatar.cc/300",
//         review: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, autem?",
//     },
//     {
//         id: 5,
//         name: "John Doe",
//         rating: 4.5,
//         avatar: "https://i.pravatar.cc/300",
//         review: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, autem?",
//     },
//     {
//         id: 6,
//         name: "John Doe",
//         rating: 4.5,
//         avatar: "https://i.pravatar.cc/300",
//         review: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, autem?",
//     },
// ];

const Testimonials = () => {
    const axiosInstance = axiosPrivateClient();

    // Note: Get all testimonials
    const { data: testimonialsData } = useQuery({
        queryKey: ["testimonials"],
        queryFn: async () => {
            const response = await axiosInstance.get(`/book/review/list`);
            return response?.data?.data || [];
        }
    });

    // Note: main render
    return (
        <section className="w-full flex flex-col items-center justify-start">
            <div className='w-full flex flex-col items-center justify-start gap-2 sm:gap-4'>
                <SectionTitle text='What Readers Are Saying' />
                <p className="text-center text-sm sm:text-base">Join thousands of happy readers who enjoy premium access every day.</p>
            </div>
            <div className="w-full mt-4 sm:mt-6 ">
                <Marquee
                    speed={50}
                    gradient={true}
                    gradientWidth={50}
                    gradientColor="#f5f5f9"
                    direction="left"
                    className="min-h-[350px]"
                >
                    {
                        testimonialsData?.length === 0 ? (
                            <>No data found</>
                        ) : (
                            testimonialsData?.map((testimony, index) => (
                                <TestimonyCard key={index} testimony={testimony} />
                            ))
                        )
                    }
                    { }
                </Marquee>
            </div>
        </section>
    )
}

export default Testimonials