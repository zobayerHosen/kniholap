import OrdersList from "@/components/dashboard/OrderList";
import React from "react";

export default function PurchasedBookPage() {
  return (
    <OrdersList
      title="My Purchased Books"
      queryKey={["my-purchased-books"]}
      endpoint="/auth/buyer/order/list"
      type="purchased"
    />
  );
}