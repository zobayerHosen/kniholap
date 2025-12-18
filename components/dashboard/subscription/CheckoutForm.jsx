"use client"
/* eslint-disable no-unused-vars */
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import { FiLoader, FiLock, FiAlertCircle, FiX, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/auth.hook";
import { axiosPrivateClient } from "@/lib/axios.private.client";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const CheckoutForm = () => {
    const axiosInstance = axiosPrivateClient();
    const stripe = useStripe();
    const elements = useElements();
    const { id } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPaymentElementReady, setIsPaymentElementReady] = useState(false);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showCancelButton, setShowCancelButton] = useState(true);
    const { userData, userRefetch } = useAuth();

    // Note: Destructure user data
    // const { is_subscribed } = userData;

    // Note: Handle payment element ready state
    useEffect(() => {
        if (!elements) return;

        const element = elements.getElement(PaymentElement);
        if (!element) return;

        const handleReady = () => setIsPaymentElementReady(true);
        element.on('ready', handleReady);

        // Listen for escape key press
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setShowCancelButton(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            element.off('ready', handleReady);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [elements]);

    // Note: Check for canceled param in URL
    useEffect(() => {
        if (!searchParams) return;

        if (searchParams.get("canceled") === "true") {
            toast.error("Payment was canceled. You can try again.");

            // Clean URL
            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            );
        }
    }, [searchParams]);

    // Note: Create payment intent
    const createPaymentIntent = useMutation({
        mutationFn: async () => {
            const res = await axiosInstance.post("/auth/subscription/setup-intent");
            if (!res.data?.data) {
                throw new Error("Failed to create payment intent");
            }
            return res?.data?.data;
        },
        onError: (err) => {
            console.error("Payment intent creation failed:", err);
            toast.error(err?.response?.data?.message || "Payment initialization failed. Please refresh and try again.");
        },
    });

    // Note: Handle subscription
    const handleSubscription = useMutation({
        mutationFn: async ({ payment_method, plan_id, isUpdating }) => {
            const res = await axiosInstance.post("/auth/subscription/create", { payment_method, plan_id });
            if (!res.data) {
                throw new Error("Subscription operation failed");
            }
            return res?.data;
        },
        onSuccess: (_, variables) => {
            const message = variables.isUpdating
                ? "Payment method updated successfully!"
                : "Subscription activated successfully!";
            toast.success(message);
            router("/", { replace: true });
            userRefetch()
        },
        onError: (err) => {
            console.error("Subscription error:", err);
            toast.error(err?.response?.data?.message || "Subscription processing failed. Please contact support.");
        },
    });

    // Note: Handle payment submission
    const handlePaymentSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) {
            setError("Payment system not initialized");
            return;
        }
        setIsProcessing(true);
        setError(null);
        setShowCancelButton(false);
        try {
            // Note: Validate payment details
            const { error: submitError } = await elements.submit();
            if (submitError) {
                throw new Error(submitError.message || "Invalid payment details");
            }
            // Note: Create payment intent
            const paymentIntentData = await createPaymentIntent.mutateAsync();
            const clientSecret = paymentIntentData?.client_secret;
            if (!clientSecret) {
                throw new Error("Payment authorization failed");
            }
            // Note: Confirm payment with Stripe (remove return_url)
            const { error: stripeError, setupIntent } = await stripe.confirmSetup({
                elements,
                clientSecret,
                // Remove the confirmParams completely or keep it empty
                redirect: "if_required", // Important for manual handling
            });
            // Note: Handle Stripe errors  // payment cancel page
            if (stripeError) {
                if (stripeError.code === "setup_intent_canceled") {
                    router('/payment-cancel', {
                        replace: true,
                        state: { fromAllowedPath: true }
                    });
                    return;
                }
                throw stripeError;
            }
            // Note: Process successful payment
            if (setupIntent.status === "succeeded") {
                await handleSubscription.mutateAsync({
                    payment_method: setupIntent.payment_method,
                    plan_id: id,
                    isUpdating: false, // give  "is_subscribed" if you want to go throw the check page when switching plan current backend handles it so it false 
                });
                // Note: Manual navigation to success page with state  // payment success page
                router("/payment-success", {
                    replace: true,
                    state: { fromAllowedPath: true }
                });
            }
        } catch (err) {
            setError(err.message || "Payment processing failed");
            console.error("Payment error:", err);
        } finally {
            setIsProcessing(false);
            setShowCancelButton(true);
        }
    };

    // Note: main component
    return (
        <div className="relative w-full flex flex-col gap-8 justify-start items-center">
            <form className="w-full flex flex-col gap-6" onSubmit={handlePaymentSubmit}>
                <PaymentElement
                    onReady={() => setIsPaymentElementReady(true)}
                />
                {/* Loading state */}
                {!isPaymentElementReady && (
                    <div className="w-full py-6 min-h-[60px] rounded-lg bg-gray-50 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 animate-shimmer" />
                        <p className="relative z-10 text-center text-gray-500">Loading secure payment form...</p>
                    </div>
                )}
                {/* Payment button */}
                {isPaymentElementReady && (
                    <motion.button
                        type="submit"
                        className="px-8 w-full justify-center py-4.5 rounded bg-gradient-to-r cursor-pointer from-indigo-600 to-indigo-700 text-white font-semibold flex items-center gap-2 hover:from-indigo-500 hover:to-indigo-600 transition-all duration-200 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={!stripe || isProcessing || handleSubscription.isPending}
                        whileTap={{ scale: !isProcessing ? 0.98 : 1 }}
                    >
                        {isProcessing || handleSubscription.isPending ? (
                            <>
                                <FiLoader className="animate-spin text-lg" />
                                {handleSubscription.isPending ? "Finalizing..." : "Processing..."}
                            </>
                        ) : (
                            <>
                                <FiLock className="text-lg" />
                                {/* {is_subscribed ? "Update Payment" : "Subscribe Now"} */}
                                Subscribe Now
                            </>
                        )}
                    </motion.button>
                )}
                {/* Error display */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="px-3 py-5 relative rounded bg-red-50 border border-red-100 text-red-600 flex items-start gap-3"
                    >
                        <FiAlertCircle className="flex-shrink-0 mt-0.5 text-xl" />
                        <div className="w-full  flex flex-col relative">
                            <p className="font-medium">Payment issue</p>
                            <p className="text-sm">{error}</p>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className=" absolute cursor-pointer top-2 right-2 bg-white  flex items-center justify-center rounded-full size-7"
                        >
                            <FiX size={14} />
                        </button>
                    </motion.div>
                )}
            </form>
            {/* Security badges */}
            <div className="w-full  flex text-gray-700 font-bold justify-center gap-6 opacity-70">
                <div className="text-xs  flex items-center gap-1">
                    <FiLock size={12} /> PCI Compliant
                </div>
                <div className="text-xs   flex items-center gap-1">
                    <FiCheckCircle size={12} /> Secure Encryption
                </div>
            </div>
        </div>
    );
};

export default CheckoutForm;