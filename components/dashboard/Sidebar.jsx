"use client"
import dashboardLogo from "@/public/dashboardLogo.png"
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiSidebar } from "react-icons/fi";
import { MdOutlineDashboard } from "react-icons/md";
import { PiBooksLight } from "react-icons/pi";
import { LuBookText } from "react-icons/lu";
import { FaCoins } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { useState } from "react";
import { useAuth } from "@/hooks/auth.hook";
import ConfirmLogoutModal from "@/components/common/ConfirmLogoutModal";
import { FaBookReader } from "react-icons/fa";



// Note: Dashboard sidebar navlist items
const navlistItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: <MdOutlineDashboard />
    },
    {
        label: "Books",
        href: "/dashboard/books",
        icon: <PiBooksLight />
    },
    {
        label: "My Purchased Books",
        href: "/dashboard/orders",
        icon: <LuBookText />
    },
    {
        label: "My Sold Books",
        href: "/dashboard/my-sold-books",
        icon: <FaBookReader />
    },
    {
        label: "Earnings",
        href: "/dashboard/earnings",
        icon: <FaCoins />
    },
    {
        label: "Settings",
        href: "/dashboard/settings",
        icon: <IoSettingsOutline />
    },
    {
        label: "Logout",
        icon: <TbLogout2 />,
        isButton: true
    }
];

const Sidebar = () => {
    const pathName = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { logout } = useAuth()

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    // Note: main ui component
    return (
        <>
            {/* Mobile toggle button */}
            <button
                className={`fixed cursor-pointer top-44 left-0 z-50 xl:hidden bg-[#A5340C] text-white p-2 rounded-tr-lg rounded-br-lg shadow-lg ${isSidebarOpen ? 'hidden' : 'block'}`}
                onClick={toggleSidebar}
            >
                <FiSidebar className="text-2xl" />
            </button>

            {/* when open sidebar set the overlay in the bg */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/75 bg-opacity-50 z-40 xl:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed xl:relative top-0 left-0 w-full max-w-[300px] h-screen bg-[#A5340C] px-6 py-5 transform transition-transform duration-300 ease-in-out z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}
            `}>
                {/* logo and collapsed icon */}
                <div className="w-full flex items-center justify-between border-b border-[#f6ebe794]">
                    {/* image */}
                    <Link
                        href={"/"}
                        className='w-[110px] h-16'
                        onClick={closeSidebar}
                    >
                        <Image
                            src={dashboardLogo}
                            alt="dashboard logo"
                            className="w-full h-full object-contain"
                        />
                    </Link>

                    {/* sidebar close button - only visible on mobile */}
                    <button
                        className="cursor-pointer xl:hidden"
                        onClick={closeSidebar}
                    >
                        <FiSidebar className="text-2xl text-white" />
                    </button>
                </div>

                {/* navlist */}
                <nav className="flex flex-col gap-3 items-start mt-9">
                    {navlistItems?.map((item, idx) => {
                        const isActive = pathName === item?.href;

                        // Note: logout button
                        if (item?.isButton) {
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setShowLogoutModal(true)}
                                    title="Sign Out"
                                    className="cursor-pointer w-full flex items-center gap-2 px-4 py-2 rounded-lg text-xl text-white hover:bg-[#ffffff33] transition-all"
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    {item.label}
                                </button>
                            )
                        }

                        // Note: other nav list
                        return (
                            <Link
                                key={idx}
                                href={item?.href}
                                onClick={closeSidebar}
                                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-xl ${isActive
                                    ? "bg-white text-[#A5340C]"
                                    : "hover:bg-[#ffffff33] text-white"
                                    }`}
                            >
                                <span className="text-lg">{item?.icon}</span>
                                {item?.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

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
        </>
    );
};
export default Sidebar;