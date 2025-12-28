import OrdersList from "@/components/dashboard/OrderList";

const PurchasedBookPage = () => {
  return (
    <OrdersList   
      title="My Purchased Books"
      queryKey={["my-purchased-books"]}
      endpoint="/auth/buyer/order/list"
      type="purchased"
    />
  );
};
export default PurchasedBookPage;