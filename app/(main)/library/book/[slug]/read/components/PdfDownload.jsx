"use client";
import { useUser } from "@/hooks/get-user.hook";
import React, { useState } from "react";
import { LuDownload } from "react-icons/lu";
import AuthRequiredModal from "@/components/common/AuthRequiredModal";

const PdfDownload = ({ book }) => {
    const { userData } = useUser();
    console.log("User data: ---> ", userData)
    const [showRequiredModal, setShowRequiredModal] = useState(false);

    const isAllowed =
        userData?.is_subscription_active === true &&
        userData?.subscription_status === "active";

    const handleClick = (e) => {
        if (!isAllowed) {
            e.preventDefault();
            setShowRequiredModal(true);
        }
    };

    return (
        <>
            <a
                href={isAllowed ? book?.pdf_file : "#"}
                target={isAllowed ? "_blank" : undefined}
                rel={isAllowed ? "noopener noreferrer" : undefined}
                onClick={handleClick}
                aria-disabled={!isAllowed}
                className={`
                    lg:size-12 size-8 shrink-0 rounded flex text-lg
                    justify-center items-center p-1 transition
                    ${isAllowed
                        ? "bg-primary text-white hover:bg-primary/90 cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70"
                    }
                `}
                title={isAllowed ? "Download PDF" : "Subscription required"}
            >
                <LuDownload />
            </a>

            {/* Modal should NOT be inside <a> */}
            <AuthRequiredModal
                isOpen={showRequiredModal}
                onClose={() => setShowRequiredModal(false)}
                text="You need to get a subscription first to download this book."
                buttonText="Subscription please.."
            />
        </>
    );
};
export default PdfDownload;