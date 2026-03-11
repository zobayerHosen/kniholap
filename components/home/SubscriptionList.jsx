"use client";
import { useQuery } from "@tanstack/react-query";
import CommonBtn from "../common/CommonBtn"
import SectionTitle from "../common/SectionTitle"
import { axiosPrivateClient } from "@/lib/axios.private.client";
import { FaCrown, FaBookOpen, FaRocket, FaCheck, FaStar, FaFire, FaGem, FaSeedling } from "react-icons/fa";
import { useUser } from "@/hooks/get-user.hook";

const SubscriptionList = () => {
    const axiosInstance = axiosPrivateClient();
    const { userData } = useUser()
    const planId = userData?.subscription_plan_id;

    // Note: get Subscription plans list
    const { data: getPlanListData } = useQuery({
        queryKey: ["getPlanListData"],
        queryFn: async () => {
            const response = await axiosInstance.get(`/subscription/plan`);
            return response?.data?.data || [];
        },
    });
    // console.log("Get plans List Data:--->", getPlanListData);

    // Helper function to get icon based on plan name
    const getPlanIcon = (planName) => {
        const name = planName?.toLowerCase();
        if (name?.includes("premium") || name?.includes("pro")) return <FaCrown className="w-6 h-6" />;
        if (name?.includes("basic")) return <FaBookOpen className="w-6 h-6" />;
        if (name?.includes("starter")) return <FaSeedling className="w-6 h-6" />;
        if (name?.includes("business") || name?.includes("enterprise")) return <FaGem className="w-6 h-6" />;
        return <FaStar className="w-6 h-6" />;
    };

    // Simplified gradient based on plan
    const getPlanColor = (planName) => {
        const name = planName?.toLowerCase();

        if (name?.includes("premium") || name?.includes("pro"))
            return "bg-gradient-to-r from-orange-500 to-yellow-500";
        if (name?.includes("basic"))
            return "bg-gradient-to-r from-orange-400 to-amber-500";
        if (name?.includes("starter"))
            return "bg-gradient-to-r from-orange-300 to-yellow-400";

        return "bg-gradient-to-r from-orange-400 to-yellow-400";
    };

    // Helper function to get accent color
    const getAccentColor = (planName) => {
        const name = planName?.toLowerCase();

        if (name?.includes("premium") || name?.includes("pro"))
            return "text-orange-600";
        if (name?.includes("basic"))
            return "text-orange-500";
        if (name?.includes("starter"))
            return "text-orange-400";

        return "text-orange-500";
    };

    // Note: main render
    return (
        <section id="subscription" className="xl:py-24 sm:py-14 py-10 w-full flex flex-col bg-gradient-to-b bg-white gap-8 md:gap-14 justify-center items-center relative overflow-hidden">
            {/* Background decorative elements with orange theme */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5">
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
            </div>

            <div className="container flex flex-col justify-center items-center gap-8 sm:gap-14 relative z-10">
                {/* title */}
                <div className="flex flex-col items-center text-white gap-4 max-w-3xl mx-auto">
                    <SectionTitle
                        text="Choose Your Perfect Plan"
                        className="text-center text-black"
                    />
                    <p className="sm:text-lg text-base text-center text-[#333] leading-relaxed">
                        Unlock premium features, trade physical books, and join a global community of readers.
                        Start your reading journey today with our flexible plans!
                    </p>
                </div>

                {/* Note: plan list */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {getPlanListData?.map((plan, index) => {
                        const isPopular = plan?.name?.toLowerCase().includes("premium") ||
                            plan?.name?.toLowerCase().includes("pro") ||
                            index === 1;

                        return (
                            <div
                                className={`relative group transition-all duration-300 ${isPopular ? '' : ''}`}
                                key={plan?.id}
                            >
                                {/* Popular Badge */}
                                {isPopular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                                        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
                                            <FaFire className="w-4 h-4" />
                                            MOST POPULAR
                                            <FaFire className="w-4 h-4" />
                                        </div>
                                    </div>
                                )}

                                {/* Plan Card */}
                                <div className={`
                                    relative h-full bg-white rounded-2xl overflow-hidden
                                    border border-orange-100 shadow-lg
                                    ${isPopular ? 'border-2 border-orange-300' : ''}
                                    group-hover:shadow-xl transition-all duration-300
                                `}>
                                    {/* Simple header with section theme */}
                                    <div className={`p-6 ${getPlanColor(plan?.name || "N/A")} text-white`}>
                                        <div className="flex items-center gap-3 mb-4 pt-5">
                                            <div className="p-2 bg-white/20 rounded-lg">
                                                {getPlanIcon(plan?.name || "N/A")}
                                            </div>
                                            <h2 className="text-2xl font-bold capitalize">
                                                {plan?.name || "N/A"}
                                            </h2>
                                        </div>

                                        <div className="flex items-end gap-1">
                                            <span className="text-4xl font-bold">€ {plan?.price || "0"}</span>
                                            <span className="text-white/90 text-lg mb-1">/{plan?.interval}</span>
                                        </div>
                                        <p className="text-white/90 text-sm mt-1">Billed {plan?.interval || "N/A"}</p>
                                    </div>

                                    {/* Features List */}
                                    <div className="p-6">
                                        <h3 className={`text-lg font-semibold ${getAccentColor(plan?.name || "N/A")} mb-4 flex items-center gap-2`}>
                                            <FaStar className="w-5 h-5" />
                                            What's Included:
                                        </h3>
                                        <ul className="space-y-3">
                                            {plan?.features?.map((feature, index) => (
                                                <li key={index} className="flex items-start gap-3">
                                                    <div className={`mt-1 shrink-0 p-1 ${getAccentColor(plan?.name || "N/A")}/20 rounded-full`}>
                                                        <FaCheck className={`w-4 h-4 ${getAccentColor(plan?.name || "N/A")}`} />
                                                    </div>
                                                    <span className="text-gray-700">
                                                        {feature?.feature || "N/A"}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Action Section */}
                                    <div className="p-6 pt-4 border-t border-gray-100">
                                        <CommonBtn
                                            className={`
                                                w-full text-center font-semibold
                                                ${getPlanColor(plan?.name)}
                                                hover:brightness-110
                                                text-white py-4 rounded-xl
                                                transition-all duration-300
                                                shadow-md hover:shadow-lg
                                                flex items-center justify-center gap-2
                                            `}
                                            link={true}
                                            path={`/subscription/plan/${plan?.id}`}
                                        >
                                            {isPopular ? (
                                                <>
                                                    Get Started Now
                                                    <FaRocket className="w-5 h-5" />
                                                </>
                                            ) : (
                                                <>
                                                    Start {plan?.name || "N/A"}
                                                    <FaBookOpen className="w-5 h-5" />
                                                </>
                                            )}
                                        </CommonBtn>
                                    </div>

                                    {/* Simple corner accent with section theme */}
                                    <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${getPlanColor(plan?.name)} opacity-10 rounded-bl-2xl`} />
                                    <div className={`absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr ${getPlanColor(plan?.name)} opacity-10 rounded-tr-2xl`} />
                                </div>

                                {/* Subtle hover effect */}
                                <div className={`absolute inset-0 ${getPlanColor(plan?.name)} opacity-0 group-hover:opacity-5 blur rounded-2xl transition-opacity duration-300 -z-10`} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    )
};
export default SubscriptionList;