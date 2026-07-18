"use client";

import { axiosPrivateClient } from "@/lib/axios.private.client";
import { loadStripe } from "@stripe/stripe-js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FiAlertCircle, FiCreditCard, FiLoader } from "react-icons/fi";
import { motion } from "framer-motion";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { FaLock } from "react-icons/fa";
import { useUser } from "@/hooks/get-user.hook";
import toast from "react-hot-toast";

const SubscriptionPlanDetails = ({ id: plan_id }) => {
    const { userData, userRefetch } = useUser();
    const isCancelled = userData?.is_cancelled === true;

    const hasActiveSubscription =
        userData?.is_subscribed &&
        userData?.is_subscription_active &&
        userData?.subscription_status === "active";


    const axiosInstance = axiosPrivateClient();
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

    // Note: check is stripePromise not found
    if (!stripePromise) {
        throw new Error("Stripe publishable key is missing");
    }

    // Note: get plan details
    const { data: planInfo, isLoading, isFetching, isError, error, refetch } = useQuery({
        queryKey: ["plan_data"],
        queryFn: async () => {
            const response = await axiosInstance.get(`/subscription/plan/${plan_id}`);
            return response?.data?.data;
        }
    });

    // Note: Modern Stripe Elements appearance configuration
    const stripeOptions = {
        mode: 'subscription',
        currency: 'eur',
        amount: planInfo?.price ? planInfo.price * 100 : 0,
        paymentMethodCreation: 'manual',
        paymentMethodTypes: ['card'],
        appearance: {
            theme: 'stripe',
            variables: {
                fontFamily: 'Roboto, Montserrat, Inter, sans-serif',
                fontWeightNormal: '500',
                colorBackground: '#ffffff',
                colorPrimary: '#f84e12',
                colorPrimaryText: '#ffffff',
                colorText: '#0a0910',
                colorTextSecondary: '#7c2709',
                colorTextPlaceholder: '#94a3b8',
                colorIcon: '#f84e12',
                colorDanger: '#ef4444',
                colorDangerText: '#ffffff',
            },
            rules: {
                '.Input': {
                    border: '1px solid #eeeeec',
                    padding: '16px 14px',
                    backgroundColor: '#f5f5f9',
                    borderRadius: '12px',
                    boxShadow: 'none',
                    transition: 'all 0.2s ease',
                },
                '.Input:focus': {
                    borderColor: '#f84e12',
                    boxShadow: '0 0 0 2px rgba(248, 78, 18, 0.15)',
                    backgroundColor: '#ffffff',
                },
                '.Input--invalid': {
                    borderColor: '#ef4444',
                    boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.15)',
                },
                '.Label': {
                    marginBottom: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#0a0910',
                },
                '.Error': {
                    fontSize: '13px',
                    marginTop: '8px',
                },
                '.Tab': {
                    border: '1px solid #eeeeec',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: '#f5f5f9',
                    transition: 'all 0.2s ease',
                },
                '.Tab:hover': {
                    color: '#f84e12',
                    borderColor: '#fba688',
                },
                '.Tab--selected': {
                    borderColor: '#f84e12',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 12px rgba(248, 78, 18, 0.08)',
                },
                '.TabIcon--selected': {
                    color: '#f84e12',
                },
            }
        }
    }

    // Note: payment cancel mutation
    const paymentCancelMutation = useMutation({
        mutationKey: ["payment-cancel"],
        mutationFn: async () => {
            const formData = new FormData()
            formData.append(plan_id, userData?.subscription_plan_id)
            const response = await axiosInstance.post(`/auth/subscription/cancel`, formData, {
                headers: {
                    "Content-type": "multipart/form-data"
                }
            });
            return response?.data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Payment cancel successfully");
            userRefetch()
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Something went wrong!");
        }
    });

    const handleCancelSubscription = () => {
        if (!userData?.subscription_plan_id) {
            toast.error("Invalid subscription plan");
            return;
        }
        paymentCancelMutation.mutate();
    };

    // Note: update plan 
    const updatePlanSubscription = useMutation({
        mutationKey: ["update-plan"],
        mutationFn: async () => {
            const formData = new FormData();
            formData.append("plan_id", plan_id);

            const response = await axiosInstance.post(
                `/auth/subscription/update`,
                formData
            );

            return response?.data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Plan updated successfully");
            userRefetch();
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Something went wrong!");
        }
    });

    // Note: submit update subscription handler
    const handleUpdateSubscription = () => {
        if (!userData?.subscription_plan_id) {
            toast.error("Invalid subscription plan");
            return;
        }
        updatePlanSubscription.mutate();
    };

    // Note: main ui component
    return (
        <div className="w-full mt-4 max-w-6xl mx-auto px-4">
            {/* payment information checkout */}
            {hasActiveSubscription && (
                <div className="w-full bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-lg mb-8 max-w-4xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 pb-5">
                        <div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full text-xs font-semibold text-green-700 border border-green-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="capitalize">{userData?.subscription_status || "Active"}</span>
                            </span>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">
                                {userData?.subscription_plan}
                            </h3>
                        </div>
                        <div className="text-left sm:text-right">
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Billing Price</p>
                            <p className="text-2xl font-extrabold text-[#7c2709] mt-0.5">
                                € {userData?.subscription_price} <span className="text-sm font-normal text-gray-500">/ {planInfo?.interval || "month"}</span>
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex flex-wrap gap-4 items-center">
                        <button
                            onClick={handleUpdateSubscription}
                            disabled={updatePlanSubscription?.isPending}
                            className="cursor-pointer px-6 py-3 bg-[#7c2709] hover:bg-[#6a2108] active:scale-[0.98] text-white font-medium rounded-xl transition-all duration-200 shadow-md shadow-[#7c2709]/10 disabled:opacity-50"
                        >
                            {updatePlanSubscription?.isPending ? "Updating..." : "Update Subscription Plan"}
                        </button>

                        {!isCancelled ? (
                            <button
                                onClick={handleCancelSubscription}
                                disabled={paymentCancelMutation.isPending}
                                className="cursor-pointer px-6 py-3 bg-[#f84e12] hover:bg-[#e6450d] active:scale-[0.98] text-white font-medium rounded-xl transition-all duration-200 shadow-md shadow-[#f84e12]/10 disabled:opacity-50"
                            >
                                {paymentCancelMutation.isPending ? "Cancelling..." : "Cancel Subscription"}
                            </button>
                        ) : (
                            <span className="px-6 py-3 bg-gray-100 text-gray-400 font-medium rounded-xl cursor-not-allowed border border-gray-200">
                                Subscription Cancelled
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* stripe payment input field */}
            {
                isLoading || isFetching ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <FiLoader className="animate-spin text-4xl text-[#f84e12] mb-4" />
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-2xl font-semibold text-center text-[#0a0910]">Loading Plan Details</h2>
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
                            <h2 className="text-2xl font-semibold text-center text-[#0a0910]">Failed to Load Plan</h2>
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
                                    className="px-6 cursor-pointer py-3 bg-[#f84e12] text-white rounded-xl hover:bg-[#e6450d] transition font-medium shadow-md shadow-[#f84e12]/10"
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
                            <h2 className="text-2xl font-semibold text-center text-[#0a0910]">Plan Not Found</h2>
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
                            className="w-full mx-auto flex flex-col gap-6 min-h-[60vh]"
                        >
                            <div className="text-center mt-6 mb-2">
                                <h1 className="xl:text-4xl text-3xl font-extrabold text-[#0a0910] tracking-tight">Kniholap Subscription</h1>
                                <p className="text-gray-500 mt-2 text-base sm:text-lg">Complete your checkout for <span className="font-semibold text-[#f84e12]">{planInfo?.name}</span></p>
                            </div>

                            {/* Payment form wrapper */}
                            <div className="w-full bg-white rounded-3xl shadow-xl p-5 sm:p-8 lg:p-10 mb-12">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                                    {/* Left Column: Plan Summary Card */}
                                    <div className="lg:col-span-5 flex flex-col gap-6 bg-gradient-to-br from-[#7c2709]/5 to-[#f84e12]/2 border border-gray-100 rounded-3xl p-6 sm:p-8">
                                        <div>
                                            <span className="inline-block px-3 py-1 bg-[#7c2709]/10 text-[#7c2709] rounded-full text-xs font-semibold uppercase tracking-wider">Selected Plan</span>
                                            <h2 className="text-3xl font-extrabold text-[#0a0910] mt-3">{planInfo?.name}</h2>
                                            <p className="text-gray-500 text-sm mt-1 capitalize">Billed {planInfo?.interval}</p>
                                        </div>

                                        <div className="py-6 border-y border-gray-200/60 my-2">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-extrabold text-[#0a0910]">
                                                    €{planInfo?.price}
                                                </span>
                                                <span className="text-gray-500 text-sm font-medium">
                                                    / {planInfo?.interval}
                                                </span>
                                            </div>
                                            {planInfo?.trial_days > 0 && (
                                                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full text-xs font-semibold text-green-700 border border-green-100">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
                                                    <span>{planInfo?.trial_days} days free trial</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Features */}
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
                                                What’s included
                                            </h4>

                                            <ul className="space-y-3">
                                                {planInfo?.features?.map((item) => (
                                                    <li key={item.id} className="flex items-start gap-3 text-sm text-gray-600">
                                                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-50 flex items-center justify-center text-green-600 text-xs font-bold">✔</span>
                                                        <span className="leading-tight">{item?.feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Right Column: Checkout Form Elements */}
                                    <div className="lg:col-span-7 flex flex-col gap-6 justify-between">
                                        <div className="flex flex-col gap-6">
                                            <div className="border-b border-gray-100 pb-4 mb-2">
                                                <h3 className="text-xl font-bold text-gray-900">Payment Details</h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Complete your subscription with secure payment
                                                </p>
                                            </div>

                                            {/* Stripe checkout */}
                                            <Elements stripe={stripePromise} options={stripeOptions}>
                                                <CheckoutForm />
                                            </Elements>
                                        </div>

                                        {/* footer */}
                                        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-green-600 font-semibold bg-green-50/50 py-3.5 rounded-2xl border border-green-100/50">
                                            <FaLock className="text-xs" />
                                            <span>Payments are secure and encrypted</span>
                                        </div>
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