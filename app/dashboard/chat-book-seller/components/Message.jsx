"use client";

import { useUser } from "@/hooks/get-user.hook";
import { motion } from "framer-motion";
import dummyImage from "@/public/dummyImage.png";
import { useState } from "react";
import Image from "next/image";

const Message = ({ message }) => {
    const { userData } = useUser();

    const {
        sender_id,
        text,
        humanize_date,
        sender = {},
        receiver_id
    } = message;

    const isMe = userData?.id === sender_id;

    // correct avatar
    const [avatar, setAvatar] = useState(
        isMe
            ? userData?.avatar || dummyImage
            : sender?.avatar || dummyImage
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            layout
            className={`mb-4 flex ${isMe ? "justify-end" : "justify-start"}`}
        >
            <div className="flex items-end gap-2 max-w-lg">

                {/* OTHER USER AVATAR */}
                {!isMe && (
                    <Image
                        src={avatar}
                        alt={sender?.first_name || "User"}
                        width={32}
                        height={32}
                        className="size-8 rounded-full border border-indigo-300 shrink-0"
                        onError={() => setAvatar(dummyImage)}
                    />
                )}

                <div className="flex flex-col gap-1">
                    <p className={`text-sm font-semibold ${isMe ? "text-teal-500 text-end" : "text-indigo-600"}`}>
                        {isMe ? "You" : `${sender?.first_name} ${sender?.last_name}`}
                    </p>

                    <div
                        className={`px-3 py-2 rounded-lg text-sm text-white ${isMe ? "bg-primary rounded-br-none" : "bg-purple-300 rounded-bl-none"
                            }`}
                    >
                        {text}
                    </div>

                    <span className={`text-xs ${isMe ? "text-right" : "text-left"} text-gray-500`}>
                        {humanize_date}
                    </span>
                </div>

                {/* MY AVATAR */}
                {isMe && (
                    <Image
                        src={avatar}
                        alt="Me"
                        width={32}
                        height={32}
                        className="size-8 rounded-full border border-[#A5340C] shrink-0"
                        onError={() => setAvatar(dummyImage)}
                    />
                )}
            </div>
        </motion.div>
    );
};

export default Message;
