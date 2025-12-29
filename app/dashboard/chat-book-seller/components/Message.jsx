"use client"
/* eslint-disable no-unused-vars */
import { useUser } from "@/hooks/get-user.hook";
import { motion } from "framer-motion";
import dummyImage from "@/public/dummyImage.png";
import { useState } from "react";
import Image from "next/image";

const Message = ({ message, otherUser = {} }) => {
    const { userData } = useUser();
    const {
        id,
        text,
        sent_at = "N/A",
        sender_id,
        sender = {},
        receiver = {}
    } = message;
    console.log("Single message: ----> ", message);

    // Note: is message sent by me
    const is_me = userData?.id === sender_id;
    const [imgURL, setImgURL] = useState(receiver?.avatar || dummyImage)
    const [mineImgURL, setMineImgURL] = useState(sender?.avatar || dummyImage)
    console.log("receiver ", receiver)

    // Note: main component
    return (
        <motion.div
            variants={{
                hidden: (message) => ({
                    opacity: 0,
                    y: 20,
                    x: is_me ? 50 : -50,
                    scale: 0.8,
                }),
                visible: {
                    opacity: 1,
                    y: 0,
                    x: 0,
                    scale: 1,
                    transition: {
                        type: "spring",
                        damping: 18,
                        stiffness: 220
                    }
                },
                exit: {
                    opacity: 0,
                    y: 10,
                    scale: 0.8,
                    transition: { duration: 0.2 }
                }
            }}
            custom={message}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
            className={`mb-4 flex ${is_me ? "justify-end" : "justify-start"}`}
        >
            <div className="relative max-w-lg flex items-end gap-2">
                {!is_me && (
                    <Image
                        src={imgURL}
                        alt={receiver?.first_name}
                        width={320}
                        height={150}
                        className="w-8 h-8 border border-indigo-300 rounded-full"
                        onError={() => setImgURL(dummyImage)}
                    />
                )}

                <div className="flex flex-col gap-1">
                    {
                        is_me ? <p className="text-sm font-semibold text-teal-500">You</p> : <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{sender?.first_name} {sender?.last_name}</p>
                    }
                    <div
                        className={`p-3 rounded text-black bg-amber-300 text-sm ${is_me
                            ? "bg-primary rounded-br-none"
                            : "bg-primary-dark rounded-bl-none"
                            }`}
                    >
                        {text}
                    </div>
                    <div className={`${is_me ? "text-right" : "text-left"} mt-1 text-xs text-indigo-700`}>
                        {sent_at}
                    </div>
                </div>
                {is_me && (
                    <Image
                        src={mineImgURL}
                        alt={sender?.first_name}
                        width={320}
                        height={150}
                        className="w-8 h-8 rounded-full border border-teal-300"
                        onError={() => setMineImgURL(dummyImage)}
                    />
                )}
            </div>
        </motion.div>
    );
};
export default Message;