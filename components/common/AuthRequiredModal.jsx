"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const AuthRequiredModal = ({ isOpen, onClose }) => {
    const router = useRouter();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white rounded-xl w-[90%] max-w-md p-6"
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-semibold text-gray-800">
                            Login Required
                        </h2>

                        <p className="text-gray-600 mt-3">
                            You need to sign in first to bookmark this book.
                        </p>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={onClose}
                                className="cursor-pointer px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => router.push("/auth")}
                                className="cursor-pointer px-4 py-2 rounded-md bg-[#A5340C] text-white hover:bg-[#8f2d0b]"
                            >
                                Go to Sign In
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
export default AuthRequiredModal;