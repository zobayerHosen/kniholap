"use client";
import SubscriptionPlanDetails from "@/components/dashboard/subscription/SubscriptionPlanDetails";
import { useParams } from "next/navigation";

export default function BookSubscription() {
  const { id } = useParams();

  // Note: main ui component
  return (
    <div className="w-full container">
      <SubscriptionPlanDetails id={id}/>
    </div>
  );
}
