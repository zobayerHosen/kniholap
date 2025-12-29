"use client"

import { motion } from "framer-motion";
import { LuSend } from "react-icons/lu";

const MessageInput = ({
    newMessage,
    setNewMessage,
    handleSendMessage,
    handleKeyPress,
}) => {
    // main component
    return (
        <div className="bg-[#A5340C] dark:border-slate-700 py-1 px-4 rounded-lg mt-2">
            <div className="flex w-full gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full pr-4 py-1 border-none bg-transparent text-white placeholder:text-white focus:outline-none focus:ring-0"
                />
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    className="bg-white cursor-pointer shrink-0 text-[#A5340C] size-8 p-2 rounded-full hover:bg-[#ffffffe1] flex items-center justify-center focus:outline-none"
                >
                    <LuSend size={18} />
                </motion.button>
            </div>
        </div>
    );
};
export default MessageInput;