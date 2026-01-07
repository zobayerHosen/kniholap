import { useUser } from '@/hooks/get-user.hook';

const UserInfo = () => {
    const { userData } = useUser();
    // Note: main ui component
    return (
        <div className="w-full">
            {/* user name and book listed */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-0">
                {/* user name and book listed */}
                <div className="w-full lg:w-auto">
                    <h2 className="text-xl sm:text-2xl font-semibold text-[#1E1E1E] text-center lg:text-start">
                        {userData?.first_name} {userData?.last_name}
                    </h2>

                    {/* book listed, delivered and ratings */}
                    <div className="flex justify-center lg:justify-start gap-4 sm:gap-6 lg:gap-8 mt-4 text-center">
                        <div>
                            <p className="text-xl sm:text-2xl font-semibold text-[#F84E12]">{userData?.total_books || "0"}</p>
                            <p className="text-[#0A0910] text-xs sm:text-sm">Book Listed</p>
                        </div>
                        <div>
                            <p className="text-xl sm:text-2xl font-semibold text-[#F84E12]">{userData?.total_delivered || "0"}</p>
                            <p className="text-[#0A0910] text-xs sm:text-sm">Delivered</p>
                        </div>
                        <div>
                            <p className="text-xl sm:text-2xl font-semibold text-[#F84E12]">{userData?.total_ratings || "0"}</p>
                            <p className="text-[#0A0910] text-xs sm:text-sm">Ratings</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* user info card */}
            <div className="w-full mt-8 lg:mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                {/* User Info Card */}
                <div className="flex flex-col gap-1.5 md:gap-3 bg-white shadow-sm border border-gray-200 rounded-xl lg:rounded-2xl p-4 lg:p-6">
                    <div className='w-full flex sm:gap-10 gap-8'>
                        <div className='space-y-1.5'>
                            <h3 className="font-semibold text-base lg:text-lg">Full name</h3>
                            <p className="text-[#1e1e1ec9] font-medium text-sm">{userData?.first_name} {userData?.last_name}</p>
                        </div>

                        <div className='space-y-1.5'>
                            <h3 className="font-semibold text-base lg:text-lg">Email Address</h3>
                            <p className="text-[#1e1e1ec9] font-medium text-sm">
                                {userData?.email}
                            </p>
                        </div>
                    </div>

                    {/* house road information */}
                    <div className="grid grid-cols-3 gap-3 mt-4 lg:mt-6 text-sm text-gray-700">
                        <div className="w-full">
                            <p className="font-semibold text-xs lg:text-sm">House</p>
                            <p className="text-xs lg:text-sm">{userData?.house || "N/A"}</p>
                        </div>
                        <div className="w-full">
                            <p className="font-semibold text-xs lg:text-sm">Road</p>
                            <p className="text-xs lg:text-sm">{userData?.road || "N/A"}</p>
                        </div>
                        <div className="w-full">
                            <p className="font-semibold text-xs lg:text-sm">City</p>
                            <p className="text-xs lg:text-sm">{userData?.city || "N/A"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default UserInfo;