"use client";
import { cn } from "@/lib/utils";
import bell from "@/public/icons/bell.png";
import { useEffect, useRef, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";

const dummyNotifications = [
    { id: 1, notifiedName: "Zobayer Hosen", message: "Test notification 01", date: "1 days ago" },
    { id: 2, notifiedName: "Zobayer Hosen", message: "Test notification 02", date: "2 days ago" },
    { id: 3, notifiedName: "Zobayer Hosen", message: "Test notification 03", date: "5 days ago" },
    { id: 4, notifiedName: "Zobayer Hosen", message: "Test notification 04", date: "6 days ago" },
    { id: 5, notifiedName: "Zobayer Hosen", message: "Test notification 05", date: "7 days ago" },
    { id: 6, notifiedName: "Zobayer Hosen", message: "Test notification 05", date: "7 days ago" },
    { id: 7, notifiedName: "Zobayer Hosen", message: "Test notification 05", date: "7 days ago" },
    { id: 8, notifiedName: "Zobayer Hosen", message: "Test notification 05", date: "7 days ago" },
];

const Notifications = ({ className }) => {
    const [isNotifications, setIsNotifications] = useState(false);
    const notificationRef = useRef(null);
    const PER_PAGE = 3;
    const [perPage, setPerPage] = useState(PER_PAGE);
    const visibleNotifications = dummyNotifications.slice(0, perPage);
    const hasMore = perPage < dummyNotifications.length;

    // Note: click outside to close notification popup
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setIsNotifications(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Note: main ui
    return (
        <div
            title="Notification"
            ref={notificationRef}
            className={cn(
                "relative size-10 flex items-center justify-center p-2 bg-primary rounded-lg shrink-0 z-100",
                className
            )}
            onClick={() => setIsNotifications(!isNotifications)}
        >
            <img className="w-full h-full object-contain" src={bell.src} alt="bell" />

            {isNotifications && (
                <div className="absolute w-96 top-11 right-0 bg-white rounded-lg shadow-lg p-4 z-50">
                    <div className="flex justify-between pb-3 border-b border-gray-300 mb-3">
                        <h5 className="text-black font-semibold">Notifications</h5>
                        <button className="text-[#F84E12] text-sm hover:underline">
                            Mark all read
                        </button>
                    </div>

                    {visibleNotifications.length === 0 ? (
                        <p className="text-sm text-gray-600">No notifications</p>
                    ) : (
                        <>
                            {visibleNotifications.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between py-3 border-b border-gray-300 last:border-none"
                                >
                                    <div className="text-start space-y-1">
                                        <h6 className="text-sm font-medium">
                                            {item.notifiedName}
                                        </h6>
                                        <p className="text-sm text-gray-500">
                                            {item.message}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        <IoNotificationsOutline className="text-xl text-[#F84E12]" />
                                        <p className="text-xs text-gray-500">
                                            {item.date}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {hasMore && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPerPage((prev) => prev + PER_PAGE);
                                    }}
                                    className="w-full cursor-pointer mt-2 py-2 text-sm font-semibold text-[#F84E12] bg-[#F84E12]/20 hover:bg-[#F84E12]/10 rounded-md"
                                >
                                    Load more
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
export default Notifications;