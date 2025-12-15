"use client";

import StarRating from "../common/StarRating";

const TestimonyCard = ({ testimony = {} }) => {
    const {
        id,
        name,
        rating,
        avatar,
        review
    } = testimony || {};

    // Note: Main ui component
    return (
        <div className="w-[260px] sm:w-[300px] min-h-[300px]  mx-3 bg-white shadow-lg rounded-2xl p-3 sm:p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="sm:size-20 size-14 rounded-full overflow-hidden border-2 sm:border-4 border-primary mb-4">
                <img src={avatar} alt={name} className="w-full h-full object-cover" />
            </div>

            <h3 className="sm:text-xl text-lg font-semibold text-gray-800">{name}</h3>

            <div className="sm:mt-2 mt-1 flex items-center justify-center gap-2">
                <StarRating rating={rating} />
                <span className="text-lg font-medium text-yellow-600">
                    {rating?.toFixed(1)}
                </span>
            </div>

            <p className="sm:mt-4 mt-2 text-gray-600 text-sm leading-relaxed italic line-clamp-3">
                “{review}”
            </p>
        </div>
    );
};
export default TestimonyCard;