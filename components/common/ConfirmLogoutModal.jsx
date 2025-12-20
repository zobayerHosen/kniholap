"use client";
import { motion, AnimatePresence } from "framer-motion";

const ConfirmLogoutModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-white rounded-xl w-[90%] max-w-md p-6"
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-semibold text-gray-800">
                            Confirm Logout
                        </h2>

                        <p className="text-gray-600 mt-3">
                            Are you sure you want to log out from your account?
                        </p>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={onClose}
                                className="cursor-pointer px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={isLoading}
                                onClick={onConfirm}
                                className="cursor-pointer px-4 py-2 rounded-md bg-[#A5340C] text-white hover:bg-[#8f2d0b] transition"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    "Logout"
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
export default ConfirmLogoutModal;