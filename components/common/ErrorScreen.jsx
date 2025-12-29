"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';
const ErrorScreen = ({ reset, error }) => {
    const router = useRouter();

    useEffect(() => {
        console.error(error);
    }, [error]);
    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 },
        },
    };

    const pulse = {
        pulse: {
            scale: [1, 1.05, 1],
            transition: { duration: 1.5, repeat: Infinity },
        },
    };
    // main ui
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={container}
            className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
        >
            <div className="p-8 text-center">
                {/* Animated error icon */}
                <motion.div variants={item} className="flex justify-center">
                    <motion.div
                        variants={pulse}
                        animate="pulse"
                        className="flex items-center justify-center h-20 w-20 rounded-full bg-red-50 mx-auto"
                    >
                        <FiAlertTriangle className="h-10 w-10 text-red-500" />
                    </motion.div>
                </motion.div>

                {/* Error title */}
                <motion.h1
                    variants={item}
                    className="mt-6 text-2xl font-bold text-gray-900"
                >
                    Something went wrong!
                </motion.h1>

                {/* Error message */}
                <motion.p
                    variants={item}
                    className="mt-3 text-gray-600"
                >
                    {error?.message || 'An unexpected error occurred'}
                </motion.p>

                {/* Buttons container */}
                <motion.div
                    variants={item}
                    className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
                >
                    {/* Retry button */}
                    <button
                        onClick={() => reset()}
                        className="px-5 py-2.5 rounded-lg cursor-pointer bg-blue-600 text-white font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                        <FiRefreshCw className="h-4 w-4" />
                        Try again
                    </button>

                    {/* Home button */}
                    <button
                        onClick={() => router.push('/')}
                        className="px-5 py-2.5 rounded-lg cursor-pointer border border-gray-300 font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                        <FiHome className="h-4 w-4" />
                        Go home
                    </button>
                </motion.div>

                {/* Error details (hidden by default) */}
                <motion.div
                    variants={item}
                    className="mt-8 text-left bg-gray-50 p-4 rounded-lg"
                >
                    <details className="text-sm text-gray-500">
                        <summary className="cursor-pointer font-medium">Error details</summary>
                        <div className="mt-2 font-mono overflow-x-auto">
                            {error?.stack || error?.toString()}
                        </div>
                        {error?.digest && (
                            <div className="mt-2">
                                <span className="font-semibold">Digest:</span> {error.digest}
                            </div>
                        )}
                    </details>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default ErrorScreen