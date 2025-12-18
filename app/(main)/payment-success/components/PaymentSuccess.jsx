import { FaLeftLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PaymentSuccess = () => {
    // Note: main ui component
    return (
        <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-pink-100 p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-[90%] max-w-md aspect-[1.618/1] bg-white shadow-xl rounded-2xl flex flex-col justify-between items-center p-8"
            >
                <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-10 h-10 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-semibold text-gray-800">
                        Payment Successful
                    </h1>
                    <p className="text-gray-500 text-center max-w-sm">
                        Thank you for your payment. Your transaction has been completed successfully. 🎉
                    </p>
                </div>
                {/* Back to Dashboard */}
                <Link
                    to="/course-generation-dashboard/my-courses"
                    className="mt-6 bg-gradient-to-r from-purple-500 to-pink-400 px-6 py-3 rounded-xl font-medium text-white flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
                >
                    <FaLeftLong />
                    Back to Dashboard
                </Link>
            </motion.div>
        </div>
    );
};
export default PaymentSuccess;