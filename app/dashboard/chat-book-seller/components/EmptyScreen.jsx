"use client"
import { FiMessageSquare } from "react-icons/fi"

const EmptyScreen = () => {
    return (
        <div className="w-full h-full border border-gray-200 mb-2 flex flex-col items-center justify-center p-4 text-center">
            <div className="mb-6 p-4 bg-blue-50 rounded-full">
                <FiMessageSquare className="text-blue-500 text-4xl" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No messages yet</h2>
            <p className="text-gray-600 max-w-md">
                Start the conversation by sending your first message
            </p>
        </div>
    );
};
export default EmptyScreen;