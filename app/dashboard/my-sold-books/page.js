import OrdersList from "@/components/dashboard/OrderList";

export default function MySoldBookPage() {
  return (
    <OrdersList
      title="My Sold Books"
      queryKey={["my-sold-books"]}
      endpoint="/auth/seller/order/list"
      type="sold"
    />
  );
}