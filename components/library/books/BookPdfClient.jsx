'use client';
import dynamic from 'next/dynamic';
import Loader from '@/components/common/Loader';
import { useUser } from '@/hooks/get-user.hook';

import Link from 'next/link';

// Dynamically import BookPdfViewInternal and disable SSR
const BookPdfView = dynamic(
    () => import('./BookPdfView'),
    {
        ssr: false,
        loading: () => <Loader text="Loading PDF Viewer..." />
    }
);

const BookPdfClient = ({ book = {} }) => {
    const { userData } = useUser();
    const isSubscribed = userData?.subscription_status;

    // If not subscribed, show subscription gate
    // if (!isSubscribed) {
    //     return <SubscriptionGate />;
    // }

    // If subscribed, show PDF viewer
    return (
        <div className="relative">
            <BookPdfView book={book} />
        </div>
    );
};

export default BookPdfClient;


// Subscription Gate Component
const SubscriptionGate = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full mx-auto">
                {/* Main Card */}
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Top Decorative Bar with #f84e12 */}
                    <div className="h-2 bg-gradient-to-r from-[#f84e12] via-[#fa6b36] to-[#f84e12]"></div>

                    {/* Lock Icon Section */}
                    <div className="relative px-6 pt-12 pb-6">
                        <div className="absolute z-10 top-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="bg-gradient-to-br from-[#f84e12] to-[#fa6b36] p-4 rounded-full shadow-lg">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="text-center mt-8">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#f84e12] to-[#fa6b36] bg-clip-text text-transparent">
                                Premium Content Locked
                            </h2>

                            <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                                This PDF is available exclusively for our subscribers.
                            </p>

                            <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-[#f84e12] p-4 mb-8 rounded-r-lg">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-[#f84e12]" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-orange-700 dark:text-orange-300">
                                            You need an active subscription to access this content.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Book Preview Placeholder */}
                            <div className="mb-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                                <div className="flex items-center justify-center space-x-4">
                                    <svg className="w-12 h-12 text-[#f84e12]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    <div className="text-left">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Book Preview</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">Subscribe to view full content</p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Buttons with #f84e12 */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/"
                                    className="inline-flex items-center justify-center px-6 py-3 bg-[#f84e12] hover:bg-[#e0440a] text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    Subscribe Now
                                </Link>

                                {/* <Link href="/dashboard"
                                    className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#f84e12] text-[#f84e12] font-semibold rounded-lg hover:bg-[#f84e12]/10 transition-all duration-200">
                                    View My Subscription
                                </Link> */}
                            </div>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-6 mt-4">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">
                            Subscribe to unlock:
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                <svg className="w-4 h-4 text-[#f84e12]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Full PDF Access</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                <svg className="w-4 h-4 text-[#f84e12]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span>Download Option</span>
                            </div>
                            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                <svg className="w-4 h-4 text-[#f84e12]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Unlimited Reading</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};