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
            router.push("/payment-success",);
            userRefetch()
        },
        onError: (err) => {
            console.error("Subscription error:", err);
            // setError(err?.response?.data?.message)
            // toast.error(err?.response?.data?.message || "Subscription processing failed. Please contact support.");
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
                    router.push('/payment-cancel');
                    return;
                }
                throw stripeError;
            }
            // Note: Process successful payment
            if (setupIntent.status === "succeeded") {
                await handleSubscription.mutateAsync({
                    payment_method: setupIntent.payment_method,
                    plan_id: id,
                    isUpdating: false,
                });
                // Note: Manual navigation to success page with state  // payment success page 
                router.push("/payment-success");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Payment processing failed");
            console.error("Payment error:", err);
        } finally {
            setIsProcessing(false);
            setShowCancelButton(true);
        }
    };

    // Note: main component
    return (
        <div className="relative w-full flex flex-col gap-6 justify-start items-center">
            <form className="w-full flex flex-col gap-6" onSubmit={handlePaymentSubmit}>
                <PaymentElement
                    onReady={() => setIsPaymentElementReady(true)}
                />
                {/* Loading state */}
                {!isPaymentElementReady && (
                    <div className="w-full py-8 min-h-[120px] rounded-2xl bg-[#f5f5f9] border border-gray-100 flex flex-col items-center justify-center gap-3">
                        <FiLoader className="animate-spin text-2xl text-[#f84e12]" />
                        <p className="text-sm font-medium text-gray-500">Loading secure payment form...</p>
                    </div>
                )}
                {/* Payment button */}
                {isPaymentElementReady && (
                    <motion.button
                        type="submit"
                        className="px-8 w-full justify-center py-4 rounded-2xl cursor-pointer bg-[#f84e12] text-white font-bold flex items-center gap-2.5 hover:bg-[#e6450d] transition-all duration-300 shadow-md shadow-orange-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        className="p-4 relative rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-start gap-3"
                    >
                        <FiAlertCircle className="flex-shrink-0 mt-0.5 text-xl" />
                        <div className="w-full flex flex-col">
                            <p className="font-semibold text-sm">Payment Issue</p>
                            <p className="text-xs mt-1 text-red-500/90 leading-relaxed">
                                {error?.response?.data?.message || error?.message || String(error)}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setError(null)}
                            className="absolute cursor-pointer top-3 right-3 bg-white hover:bg-gray-100 transition flex items-center justify-center rounded-full size-6 shadow-sm border border-gray-100"
                        >
                            <FiX size={12} className="text-gray-500" />
                        </button>
                    </motion.div>
                )}
            </form>
            {/* Security badges */}
            <div className="w-full flex text-gray-400 font-semibold justify-center gap-6 border-t border-gray-100 pt-6 mt-2">
                <div className="text-xs flex items-center gap-1.5 hover:text-gray-600 transition">
                    <FiLock size={13} className="text-[#f84e12]" /> <span>PCI Compliant</span>
                </div>
                <div className="text-xs flex items-center gap-1.5 hover:text-gray-600 transition">
                    <FiCheckCircle size={13} className="text-[#f84e12]" /> <span>Secure 256-bit SSL</span>
                </div>
            </div>
        </div>
    );
};

export default CheckoutForm;