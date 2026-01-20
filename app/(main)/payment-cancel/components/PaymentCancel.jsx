"use client"
import { FaLeftLong } from "react-icons/fa6";
import { motion } from "framer-motion";
import Link from "next/link";

const PaymentCancel = () => {
    // Note: main ui component
    return (
        <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-white to-orange-100 p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-[90%] max-w-md aspect-[1.618/1] bg-white shadow-xl rounded-2xl flex flex-col justify-between items-center p-8"
            >
                <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-10 h-10 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-semibold text-gray-800">
                        Payment Cancelled
                    </h1>
                    <p className="text-gray-500 text-center max-w-sm">
                        Your transaction was not completed. Please try again or return to your dashboard.
                    </p>
                </div>
                {/* Back to dashboard */}
                <Link
                    href="/"
                    className="mt-6 bg-gradient-to-r from-red-500 to-orange-400 px-6 py-3 rounded-xl font-medium text-white flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
                >
                    <FaLeftLong />
                    Back to Home
                </Link>
            </motion.div>
        </div>
    );
};
export default PaymentCancel;