const SoldBookDetailsSkeleton = ({ showChat }) => {
    return (
        <div className={`w-full grid gap-6 ${showChat ? "lg:grid-cols-3" : "lg:grid-cols-1"}`}>

            {/* Left Side: Sold Book Details Skeleton */}
            <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm">

                {/* Header Skeleton */}
                <div className="flex items-center justify-between mb-6">
                    <div className="h-7 w-48 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                </div>

                {/* Book Info Skeleton */}
                <div className="flex flex-col sm:flex-row gap-6">
                    {/* Book Image Skeleton */}
                    <div className="relative w-full sm:w-40 h-52 bg-gray-100 rounded-xl overflow-hidden animate-pulse">
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100"></div>
                    </div>

                    {/* Book Meta Skeleton */}
                    <div className="flex-1 space-y-3">
                        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>

                        <div className="pt-2 space-y-2">
                            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-6 border-t"></div>

                {/* Order Summary Skeleton */}
                <div>
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>

                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="space-y-2">
                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse ml-auto"></div>
                            </div>
                        ))}

                        <div className="col-span-2 border-t my-2"></div>

                        <div className="h-5 w-28 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse ml-auto"></div>
                    </div>
                </div>

                {/* Shipping Address Skeleton */}
                <div className="mt-6">
                    <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mt-1"></div>
                </div>
            </div>

            {/* Right Side: Chat Skeleton (if showChat is true) */}
            {showChat && (
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm flex flex-col">

                    {/* Chat Header Skeleton */}
                    <div className="h-7 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>

                    {/* Chat Messages Area Skeleton */}
                    <div className="w-full border border-t-0 border-slate-300 mb-2 h-full p-2 md:p-4 overflow-y-auto">
                        {/* Empty state skeleton or chat messages skeleton */}
                        <div className="flex flex-col space-y-4">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className={`flex ${item % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs md:max-w-md ${item % 2 === 0 ? 'bg-blue-100' : 'bg-gray-100'} rounded-2xl p-3 animate-pulse`}>
                                        <div className="h-4 w-48 bg-gray-300 rounded"></div>
                                        <div className="h-3 w-16 bg-gray-300 rounded mt-2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Input Skeleton */}
                    <div className="mt-4">
                        <div className="flex gap-3">
                            <div className="flex-1 h-12 bg-gray-100 rounded-xl animate-pulse"></div>
                            <div className="w-12 h-12 bg-gray-100 rounded-xl animate-pulse"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default SoldBookDetailsSkeleton;