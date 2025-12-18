import Image from "next/image";
import { FaStar } from "react-icons/fa";
import dummyImage from "@/public/dummyImage.png"
import { useState } from "react";


const ReviewCard = ({ review }) => {
    const {
        first_name,
        last_name,
        rating = 0,
        avatar,
        review: comment,
    } = review || {};

    const name = `${first_name || ""} ${last_name || ""}`.trim();
    const [imageURL, setImageURL] = useState(avatar || dummyImage);

    // Note: main ui component
    return (
        <div className="w-full bg-[#7C2709] text-white rounded-lg p-4 flex flex-col gap-3">
            {/* Reviewer Info */}
            <div className="w-full flex items-center gap-3">
                <div className="size-10 bg-[#444444c0] rounded-full shrink-0">
                    <Image
                        src={imageURL}
                        alt={name}
                        width={300}
                        height={300}
                        className="w-full h-full rounded-full object-cover"
                        onError={() => setImageURL(dummyImage)}
                    />
                </div>

                {/* Name and Rating */}
                <div className="w-full">
                    <h3 className="font-semibold text-base">
                        {name || "Anonymous"}
                    </h3>

                    <div className="flex items-center gap-1 text-yellow-400">
                        {Array.from({ length: 5 }, (_, i) => (
                            <FaStar
                                key={i}
                                className={
                                    i < Math.round(rating)
                                        ? "opacity-100"
                                        : "opacity-30"
                                }
                            />
                        ))}
                        <span className="text-sm text-white ml-1">
                            {rating.toFixed(1)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Review Text */}
            <p className="text-sm text-gray-100 leading-relaxed">
                {comment || "No review provided"}
            </p>
        </div>
    );
};
export default ReviewCard;