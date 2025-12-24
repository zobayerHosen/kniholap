"use client"
import Image from "next/image";

const SalesCalculateCart = ({ item = {} }) => {

    const { id, title, value, image } = item;

    // Note: main ui component
    return (
        <div className="w-full bg-white shadow-lg p-4 2xl:p-6 flex flex-col gap-3 2xl:gap-6 rounded-xl 2xl:rounded-3xl">
            {/* image */}
            <div className="h-[120px] bg-[#FBA688] px-6 py-5 border border-[#F84E12] rounded-2xl flex flex-col items-center justify-center">
                <div className="size-16">
                    <Image
                        src={image}
                        alt={title}
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>

            {/* sales information */}
            <div className="flex flex-col gap-1 lg:gap-3">
                <h6 className="md:text-2xl text-xl text-black font-medium">{value}</h6>
                <span className="sm:text-base text-sm text-[rgba(0,0,0,0.60)] font-medium">{title}</span>
            </div>
        </div>
    );
};
export default SalesCalculateCart;