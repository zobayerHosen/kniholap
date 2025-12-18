"use client";

import { axiosPrivateClient } from "@/lib/axios.private.client";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import { FiCreditCard, FiLoader } from "react-icons/fi";
import { motion } from "framer-motion";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { FaLock } from "react-icons/fa";

const SubscriptionPlanDetails = ({ id: plan_id }) => {
    const axiosInstance = axiosPrivateClient();
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

    // Note: check is stripePromise not found
    if (!stripePromise) {
        throw new Error("Stripe publishable key is missing");
    }

    // Note: get plan details
    const { data: planInfo, isLoading, isFetching, isError, refetch } = useQuery({
        queryKey: ["plan_data"],
        queryFn: async () => {
            const response = await axiosInstance.get(`/subscription/plan/${plan_id}`);
            return response?.data?.data;
        }
    });
    console.log("Plan info:--->", planInfo)

    // Note: Modern Stripe Elements appearance configuration
    const stripeOptions = {
        mode: 'subscription',
        currency: 'usd',
        amount:  planInfo?.price || 5,  // 
        paymentMethodCreation: 'manual',
        paymentMethodTypes: ['card'],
        appearance: {
            theme: 'stripe',
            variables: {
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeightNormal: '500',
                colorBackground: '#ffffff',
                colorPrimary: '#6366f1',
                colorPrimaryText: '#ffffff',
                colorText: '#1e293b',
                colorTextSecondary: '#64748b',
                colorTextPlaceholder: '#94a3b8',
                colorIcon: '#94a3b8',
                colorDanger: '#ef4444',
                colorDangerText: '#ffffff',
            },
            rules: {
                '.Input': {
                    border: '1px solid #e2e8f0',
                    padding: '20px 16px',
                    backgroundColor: 'transparent',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                },
                '.Input:focus': {
                    borderColor: '#6366f1',
                    boxShadow: '0 0 0 1px #6366f1',
                },
                '.Input--invalid': {
                    borderColor: '#ef4444',
                    boxShadow: '0 0 0 1px #ef4444',
                },
                '.Label': {
                    marginBottom: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#1e293b',
                },
                '.Error': {
                    fontSize: '13px',
                    marginTop: '8px',
                },
                '.Tab': {
                    border: '1px solid #e2e8f0',
                    padding: '10px 12px',
                },
                '.Tab:hover': {
                    color: '#6366f1',
                    borderColor: '#c7d2fe',
                },
                '.Tab--selected': {
                    borderColor: '#6366f1',
                },
                '.TabIcon--selected': {
                    color: '#6366f1',
                },
            }
        }
    }
    // Note: main ui component
    return (
        <div className="w-full mt-4">
            {
                isLoading || isFetching ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <FiLoader className="animate-spin text-4xl text-primary mb-4" />
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-2xl font-semibold text-center">Loading Plan Details</h2>
                            <p className="text-gray-500 mt-2 text-center">
                                We&lsquo;re getting everything ready for you...
                            </p>
                        </motion.div>
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <FiAlertCircle className="text-4xl text-red-500 mb-4" />
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-2xl font-semibold text-center">Failed to Load Plan</h2>
                            <p className="text-gray-500 mt-2 text-center max-w-md">
                                We couldn&rsquo;t load the subscription details. Please try again later.
                            </p>
                            <p className="text-sm text-gray-400 mt-4 text-center">
                                Error: {error?.message || "Unknown error occurred"}
                            </p>
                            <div className="mt-6 text-center">
                                <button
                                    disabled={isFetching || isLoading}
                                    onClick={refetch}
                                    className="px-4 cursor-pointer py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition"
                                >
                                    Retry
                                </button>
                            </div>
                        </motion.div>
                    </div>
                ) : !planInfo ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <FiCreditCard className="text-4xl text-gray-400 mb-4" />
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-2xl font-semibold text-center">Plan Not Found</h2>
                            <p className="text-gray-500 mt-2 text-center">
                                The subscription plan you&lsquo;re looking for doesn&#39;t exist or is no longer available.
                            </p>
                        </motion.div>
                    </div>
                ) : (
                    <>
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-full max-w-6xl mx-auto flex flex-col gap-3 sm:gap-5 min-h-[60vh]"
                        >
                            <p className="text-center xl:text-3xl text-2xl ">Kniholap Subscription Plans!</p>

                            {/* plan information  */}
                            <div className="w-full flex flex-col gap-3 justify-start items-center">
                                <p className="text-center capitalize font-medium text-xl">
                                    Pay for {planInfo?.name || "N/A"}
                                </p>
                            </div>
                            {/* Payment form wrapper */}
                            <div className="w-full flex flex-col gap-3 sm:gap-5 p-3 sm:p-6 bg-white  shadow-sm border border-gray-100">
                                {/* Header  */}
                                <div className="w-full flex flex-col gap-1">
                                    <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
                                    <p className="text-sm text-gray-500 ">
                                        Complete your subscription with secure payment
                                    </p>
                                </div>

                                {/* specific Plan details */}
                                <div className="w-full border border-gray-200 rounded-lg p-5 bg-gray-50">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {planInfo?.name}
                                    </h2>

                                    <p className="text-gray-600 mt-1 capitalize">
                                        Billed {planInfo?.interval}
                                    </p>

                                    <div className="mt-4 flex items-end gap-2">
                                        <span className="text-3xl font-bold text-gray-900">
                                            ${planInfo?.price}
                                        </span>
                                        <span className="text-gray-500 text-sm">
                                            / {planInfo?.interval}
                                        </span>
                                    </div>

                                    {/* Trial info */}
                                    {planInfo?.trial_days > 0 && (
                                        <p className="mt-2 text-sm text-green-600">
                                            {planInfo?.trial_days} days free trial
                                        </p>
                                    )}

                                    {/* Features */}
                                    <div className="mt-5">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                            What’s included
                                        </h4>

                                        <ul className="space-y-2">
                                            {planInfo?.features?.map((item) => (
                                                <li key={item.id} className="flex items-center gap-2 text-sm text-gray-600">
                                                    <span className="text-green-500">✔</span>
                                                    {item?.feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* form */}
                                <Elements stripe={stripePromise} options={stripeOptions}>
                                    <CheckoutForm />
                                </Elements>
                                {/* footer */}
                                <div className=" w-full flex items-center justify-center">
                                    <div className="flex items-center space-x-2 text-sm text-green-500">
                                        <FaLock />
                                        <span>Payments are secure and encrypted</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )
            }
        </div>
    );
};
export default SubscriptionPlanDetails;