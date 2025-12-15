"use client";
import CommonBtn from "@/components/common/CommonBtn";
import useCheckout from "@/hooks/checkout.hook";
import Modal from "antd/es/modal/Modal";

const CheckoutButton = ({ book }) => {
    const { id } = book || {};
    const { handleCheckoutMutation, isError, setIsError } = useCheckout();

    // Note: handle checkout mutation
    const handleCheckout = () => {
        handleCheckoutMutation.mutate({ book_id: id });
    }

    // Note: main ui component
    return (
        <>
            {
                isError && (
                    <Modal
                        centered
                        open={true}
                        onCancel={() => setIsError(false)}
                        
                    >
                        <p className="text-2xl">{isError}</p>
                    </Modal>
                )
            }
            {book?.type === "ebook" ? (
                <CommonBtn
                    link={true}
                    path={`/library/book/${book?.slug}/read`}
                    className="rounded-full hover:opacity-90 hover:bg-secondary transition-colors duration-300 hover:text-white"
                >
                    Read Now
                </CommonBtn>
            ) : (
                <CommonBtn
                    onclick={handleCheckout}
                    disabled={handleCheckoutMutation.isPending}
                    className="rounded-full hover:opacity-90 hover:bg-secondary transition-colors duration-300 hover:text-white"
                >
                    {handleCheckoutMutation.isPending ? "Loading..." : "Buy Now"}
                </CommonBtn>
            )}
        </>
    );
};
export default CheckoutButton;