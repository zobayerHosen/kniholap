"use client";
import { useQuery } from "@tanstack/react-query";
import CommonBtn from "../common/CommonBtn"
import SectionTitle from "../common/SectionTitle"
import { axiosPrivateClient } from "@/lib/axios.private.client";

const SubscriptionList = () => {
    const axiosInstance = axiosPrivateClient();

    // Note: get Subscription plans list
    const { data: getPlanListData } = useQuery({
        queryKey: ["getPlanListData"],
        queryFn: async () => {
            const response = await axiosInstance.get(`/subscription/plan`);
            return response?.data?.data || [];
        },
    });
    console.log("Get plans List Data:--->", getPlanListData);

    // Note: main render
    return (
        <section id="subscription" className="xl:py-20 sm:py-10 py-6 border w-full flex flex-col bg-secondary gap-5 md:gap-10 justify-center items-center">
            <div className="container flex flex-col justify-center items-center gap-5 sm:gap-10">
                <div className="flex flex-col items-center text-white gap-2">
                    <SectionTitle text="Choose Your Subscription" />
                    <p className="sm:text-base text-sm text-center">Trade physical books, read premium eBooks, and connect with readers worldwide.</p>
                </div>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-8">
                    {
                        getPlanListData?.map((plan) => (
                            <div className="w-full bg-white rounded-xl flex flex-col p-3 md:p-4" key={plan?.id}>
                                <h1 className="md:text-3xl text-xl font-semibold capitalize">{plan?.name || "N/A"} plan - <span className="text-xl font-normal">${plan?.price || "0"}</span></h1>
                                <ul className="md:mt-4 mt-2 h-full list-disc pl-5">
                                    {
                                        plan?.features?.map((feature, index) => (
                                            <li key={index} className="sm:my-2 my-1 text-sm sm:text-base">{feature?.feature || "N/A"}</li>
                                        ))
                                    }
                                </ul>
                                <div className="shrink-0 w-full flex lg:flex-row flex-col gap-3 lg:gap-6 mt-4 justify-start items-center">
                                    <CommonBtn className={`w-full`} link={true} path={`/subscription/plan/${plan?.id}`}>
                                        Start {plan?.name || "N/A"} access
                                    </CommonBtn>
                                    {
                                        plan?.name && (
                                            <span className="text-sm px-5 py-2 md:py-4 bg-primary text-white shrink-0 font-semibold capitalize rounded-xl w-full lg:w-auto min-h-[44px] md:min-h-[56px] flex justify-center items-center">MOST POPULAR</span>
                                        )
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </section>
    )
};
export default SubscriptionList;