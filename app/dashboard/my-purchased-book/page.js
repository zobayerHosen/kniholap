import DashboardOrdersList from "@/components/dashboard/my-purchased-book/DashboardOrdersList";
import React from "react";

const OrdersPage = () => {
  return (
    <div className="w-full">
      <DashboardOrdersList />
      {/* <OldOrderList /> */}
    </div>
  );
};
export default OrdersPage;