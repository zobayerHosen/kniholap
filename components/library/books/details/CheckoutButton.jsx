"use client";
import CommonBtn from "@/components/common/CommonBtn";
import useCheckout from "@/hooks/checkout.hook";

const CheckoutButton = ({ book }) => {
    const { id } = book || {};
    const { handleCheckoutMutation } = useCheckout();

    // Note: handle checkout mutation
    const handleCheckout = () => {
        handleCheckoutMutation.mutate({ book_id: id });
    }

    // Note: main ui component
    return (
        <>
            {book?.type === "ebook" ? (
                <CommonBtn
                    link={true}
                    path={`/library/book/${book?.slug}/read`}
                    className="rounded-full hover:opacity-90 hover:bg-secondary transition-colors duration-300 xl:mt-5 hover:text-white"
                >
                    Read Now
                </CommonBtn>
            ) : (
                <CommonBtn
                    onclick={handleCheckout}
                    disabled={handleCheckoutMutation.isPending}
                    className="rounded-full hover:opacity-90 hover:bg-secondary transition-colors duration-300 xl:mt-5 hover:text-white"
                >
                    {handleCheckoutMutation.isPending ? "Loading..." : "Buy Now"}
                </CommonBtn>
            )}
        </>
    );
};
export default CheckoutButton;