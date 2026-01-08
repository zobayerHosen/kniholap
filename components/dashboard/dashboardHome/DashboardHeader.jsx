"use client"
// import Image from "next/image";
import { BiSearchAlt } from "react-icons/bi";
import { MdOutlineNotificationsActive } from "react-icons/md";
import dummyUserImage from "@/public/dummyUserImage.jpg"
import { useUser } from "@/hooks/get-user.hook";
import { Popover } from "antd";
import { useAuth } from "@/hooks/auth.hook";
import ConfirmLogoutModal from "@/components/common/ConfirmLogoutModal";
import { useState } from "react";
const DashboardHeader = () => {
    const { userData } = useUser()
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { logout } = useAuth();

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    // Note: popover content
    const popoverContent = (
        <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 rounded-md cursor-pointer">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                />
            </svg>
            Logout
        </button>
    );

    // Note: main ui
    return (
        <header className="w-full flex flex-col xs:flex-row items-center justify-between bg-[#A5340C] py-4 px-6 text-white md:gap-8 gap-3">
            {/* Search input with icon */}
            <div className="relative w-full sm:max-w-2xl order-2 sm:order-1">
                <BiSearchAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A5340C] md:size-6 size-5" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-white rounded-full pl-11 pr-6 md:py-2.5 py-1.5 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A5340C]/50"
                />
            </div>

            {/* Right-side area (optional icons, profile, etc.) */}
            <div className="flex items-center gap-3 lg:gap-6 order-1 sm:order-2 w-full sm:w-auto justify-between xs:justify-normal">
                {/* notifications icon */}
                <button
                    className="cursor-pointer flex items-center justify-center bg-white rounded-full p-2 hover:bg-gray-100 hover:scale-105 transition-all duration-300 ease-in-out"
                >
                    <MdOutlineNotificationsActive
                        className="md:size-6 size-5 text-[#F84E12]"
                    />
                </button>

                {/* user avatar */}
                <div className="md:size-10 size-9 rounded-full cursor-pointer">
                    {/* avatar + popover */}
                    <Popover
                        content={popoverContent}
                        trigger="click"
                        placement="bottomRight"
                        overlayClassName="rounded-md"
                        arrow={false}
                    >
                        <div className="md:size-10 size-9 rounded-full cursor-pointer">
                            <img
                                src={userData?.avatar || dummyUserImage}
                                alt="user avatar"
                                className="w-full h-full object-cover rounded-full"
                                width={40}
                                height={40}
                            />
                        </div>
                    </Popover>
                </div>
            </div>

            <ConfirmLogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={() =>
                    logout.mutate(undefined, {
                        onSuccess: () => {
                            setShowLogoutModal(false);
                            closeSidebar(false)
                        }
                    })
                }
                isLoading={logout.isPending}
            />
        </header>
    );
};
export default DashboardHeader;