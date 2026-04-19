"use client";
import Image from "next/image";
import dummyImage from "@/public/dummyImage.png";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosPrivateClient } from "@/lib/axios.private.client";
import MessageInput from "../../chat-book-seller/components/MessageInput";
import Message from "../../chat-book-seller/components/Message";
import { AnimatePresence } from "framer-motion";
import EmptyScreen from "../../chat-book-seller/components/EmptyScreen";
import { useUser } from "@/hooks/get-user.hook";
import { useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import SoldBookDetailsSkeleton from "@/components/dashboard/SoldBookDetailsSkeleton";
import ErrorScreen from "@/components/common/ErrorScreen";
import echo from "@/lib/echo";
import toast from "react-hot-toast";

const MyPurchasedBooksComponent = ({ params_id, showChat }) => {
    const searchParams = useSearchParams();
    const role = searchParams.get("role");
    const { userData } = useUser()
    const axiosInstance = axiosPrivateClient();

    // Note: get sold book details
    const { data: getSoldBookDetails, refetch: refetchOrderDetais, isLoading: purchasedLoading, isFetching: purchasedFetching } = useQuery({
        queryKey: ['purchased-book-details', params_id],
        queryFn: async () => {
            const response = await axiosInstance.get(`/auth/buyer/order/details/${params_id}`);
            return response?.data?.data || {};
        },
        enabled: !!params_id
    });
    console.log("Sold book details data: --->", getSoldBookDetails);

    // Note: destructure all properties
    const {
        id,
        order_number,
        total_amount,
        room_id,
        book_price,
        shipping_cost,
        platform_fee,
        shipping_address,
        status,
        paid_at,
        book = {},
    } = getSoldBookDetails || {};

    const { title, author, cover_image, type, price } = book;
    const [imageSrc, setImageSrc] = useState(dummyImage);
    useEffect(() => {
        if (cover_image) {
            setImageSrc(cover_image);
        } else {
            setImageSrc(dummyImage);
        }
    }, [cover_image]);

    // Note: chating
    // State for new message input
    const [newMessage, setNewMessage] = useState("");
    // Refs for DOM elements
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    // Note: State for storing messages
    const [messages, setMessages] = useState([]);
    // Track processed message IDs to avoid duplicates
    const processedMessageIds = useRef(new Set());

    // Note: Fetch chat room data and messages
    const {
        data: roomData,
        isError: roomDataError,
        isLoading: roomDataLoading,
        isFetching,
        refetch
    } = useQuery({
        queryKey: ["chat_room_messages", room_id],
        queryFn: async () => {
            const response = await axiosInstance.get(`/auth/chat/room/${room_id}`);
            return response?.data?.data || {};
        },
        enabled: !!room_id,
    });
    console.log("Room Data : ----->", roomData);

    // Note: Function to scroll to the bottom of the messages
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    // Note: Update messages when roomData changes
    useEffect(() => {
        if (roomData?.messages) {
            setMessages(roomData?.messages);
            // Update processed message IDs
            processedMessageIds.current = new Set(roomData?.messages.map(m => m.id));
        }
    }, [roomData]);

    // Note: Format message object consistently
    const formatMessage = useCallback(
        (message) => {
            const sender = message?.sender || {};
            const receiver = message?.receiver || roomData?.receiver || {};

            return {
                id: message?.id || uuidv4(),

                // sender info (normalized)
                sender_id: sender?.id || message?.sender_id,
                sender: sender,
                receiver: receiver,

                // UI-friendly fields
                sender_name:
                    sender?.first_name
                        ? `${sender.first_name} ${sender.last_name || ""}`
                        : sender?.id === userData?.id
                            ? "You"
                            : `${receiver?.first_name || ""} ${receiver?.last_name || ""}`,

                sender_image: sender?.avatar || null,

                // message body
                text: message?.text || message?.message || "",

                // time
                sent_at:
                    message?.humanize_date ||
                    message?.sent_at ||
                    new Date().toLocaleTimeString(),

                // temp flag
                isTemp: Boolean(message?.isTemp),
            };
        },
        [userData?.id, roomData]
    );

    // Note: Mutation for sending messages
    const { mutate: sendMessage } = useMutation({
        mutationFn: async (tempId) => {
            const response = await axiosInstance.post(
                `/auth/chat/send/${roomData?.receiver?.id}`,
                {
                    text: newMessage,
                    room_id: room_id
                }
            );
            return response?.data?.data?.chat;
        },

        onSuccess: (chat) => {
            if (!chat) return;
            // Note: replace temp message with real one
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === chat.temp_id || m.isTemp ? formatMessage(chat) : m
                )
            );

            processedMessageIds.current.add(chat.id);
            setNewMessage("");
        },
        onError: (_err, tempId) => {
            setMessages((prev) => prev.filter((m) => m.id !== tempId));
            processedMessageIds.current.delete(tempId);
        },
    });

    // Note: order confirmation mutation
    const orderConfirmationMuttion = useMutation({
        mutationKey: ["order-confirmation"],
        mutationFn: async (id) => {
            const response = await axiosInstance.post(`/auth/buyer/order/delivery/confirm`, {
                order_id: id
            });
            return response?.data;
        },
        onSuccess: () => {
            toast.success("Order confirmation successfully!")
            refetchOrderDetais()
        },
        onError: (error) => {
            console.log("Error", error)
            toast.error("Something went wrong!")
        }
    });

    // Note: handle confirmation handler
    const handleOrderConfirmation = () => {
        orderConfirmationMuttion.mutate(id);
    };

    // Note: Handler for new incoming messages
    const handleNewMessage = useCallback((message) => {
        // Skip if messages has no ID or already processed
        if (!message?.id || processedMessageIds.current.has(message.id)) {
            return;
        }
        setMessages(prev => {
            // Skip if messages already exists
            if (prev.some(m => m.id === message.id)) return prev;
            return [...prev, formatMessage(message)];
        });
        // Mark message as processed
        processedMessageIds.current.add(message.id);
    }, [formatMessage]);

    // Note: Setup Echo channels for real-time updates
    useEffect(() => {
        if (!room_id || !userData) return;

        // Join private channels for real-time messaging
        const roomChannel = echo.private(`chat-room.${room_id}`);
        const receiverChannel = echo.private(`chat-receiver.${userData.id}`);
        const senderChannel = echo.private(`chat-sender.${userData.id}`);

        // Listen for message events
        roomChannel.listen('MessageSendEvent', (data) => handleNewMessage(data?.data));
        receiverChannel.listen('MessageSendEvent', (data) => handleNewMessage(data?.data));
        senderChannel.listen('MessageSendEvent', (data) => handleNewMessage(data?.data));

        // Cleanup: leave channels when component unmounts
        return () => {
            echo.leave(`chat-room.${room_id}`);
            echo.leave(`chat-receiver.${userData.id}`);
            echo.leave(`chat-sender.${userData.id}`);
        };
    }, [room_id, userData, handleNewMessage]);

    // Note: Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Note: Send message handler
    const handleSendMessage = () => {
        if (!newMessage.trim() || !roomData?.receiver?.id) return;

        const tempId = uuidv4();

        const tempMessage = {
            id: tempId,
            sender_id: userData.id,
            text: newMessage,
            sender: userData,
            humanize_date: "sending...",
            isTemp: true,
        };

        // optimistic UI
        setMessages((prev) => [...prev, formatMessage(tempMessage)]);
        processedMessageIds.current.add(tempId);

        sendMessage(tempId);
    };

    // Note: Handle Enter key press for sending messages
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Note: Loading state
    if (roomDataLoading || isFetching || purchasedLoading || purchasedFetching) {
        return <SoldBookDetailsSkeleton showChat={showChat} />;
    }

    // Note: Error state
    if (roomDataError) {
        return <ErrorScreen refetch={refetch} />;
    };


    // Note: main ui component
    return (
        <div className={`w-full grid gap-6 ${showChat ? "lg:grid-cols-3" : "lg:grid-cols-1"}`}>

            {/* ================= Left Side : Sold Book Details ================= */}
            <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm h-fit">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Sold Book Details
                    </h2>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize">
                        {status}
                    </span>
                </div>

                {/* Book Info */}
                <div className="flex flex-col sm:flex-row gap-6">
                    {/* Book Image */}
                    <div className="relative w-full sm:w-40 h-52 bg-gray-50 rounded-xl overflow-hidden">
                        <Image
                            src={imageSrc || imageSrc}
                            alt={title || ""}
                            fill
                            className="object-contain p-4"
                            onError={() => setImageSrc(dummyImage)}
                        />
                    </div>

                    {/* Book Meta */}
                    <div className="flex-1 space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-600">
                            by {author}
                        </p>

                        <div className="text-sm text-gray-700 pt-2 space-y-1">
                            <p>Book Type: <span className="font-medium">{type}</span></p>
                            <p>Book Price: <span className="font-medium">€{price}</span></p>
                            <p>Order ID: <span className="font-medium">{order_number}</span></p>
                            <p>Paid At: <span className="font-medium">{paid_at}</span></p>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-6 border-t" />

                {/* Order Summary */}
                <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4">
                        Order Summary
                    </h4>

                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                        <p className="text-gray-600">Book Price</p>
                        <p className="text-right font-medium">€{book_price}</p>

                        <p className="text-gray-600">Shipping Cost</p>
                        <p className="text-right font-medium">€{shipping_cost}</p>

                        <p className="text-gray-600">Platform Fee</p>
                        <p className="text-right font-medium">€{platform_fee}</p>

                        <div className="col-span-2 border-t my-2" />

                        <p className="text-gray-900 font-semibold">Total Amount</p>
                        <p className="text-right font-semibold text-gray-900">
                            €{total_amount}
                        </p>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="mt-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-2">
                        Shipping Address
                    </h4>
                    <p className="text-sm text-gray-600">
                        {shipping_address}
                    </p>
                </div>

                {/* order confirmation button */}
                <div className="w-full mt-5 flex justify-end">
                    {status !== "completed" && (
                        <div className="w-full mt-5 flex justify-end">
                            <button
                                onClick={handleOrderConfirmation}
                                disabled={orderConfirmationMuttion.isPending}
                                className={`w-full cursor-pointer text-center px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${orderConfirmationMuttion.isPending
                                    ? "bg-gray-400 text-white cursor-not-allowed blur-[1px]"
                                    : "bg-gradient-to-r from-primary to-primary/80 text-white hover:shadow-lg"
                                    }`}
                            >
                                {orderConfirmationMuttion.isPending ? "Confirming..." : "Confirm Order"}
                            </button>
                        </div>
                    )}
                </div>

            </div>

            {/* ================= Chat with Buyer ================= */}
            {
                showChat && (
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm flex flex-col h-[620px] overflow-y-auto">

                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            {role === "seller" ? "Chat with Buyer" : "Chat with Seller"}
                        </h2>

                        {/* Chat Messages Area */}
                        {messages?.length === 0 ? (
                            <EmptyScreen />
                        ) : (
                            <div className="w-full border border-t-0 border-slate-300 mb-2 h-full p-2 md:p-4 overflow-y-auto">
                                {/* Animate message appearance/disappearance */}
                                <AnimatePresence>
                                    {messages?.map((message, idx) => (
                                        <Message
                                            key={idx}
                                            message={message}
                                            isCurrentUser={message.sender_id === userData?.id}
                                            isTemp={message.isTemp}
                                        />
                                    ))}
                                </AnimatePresence>
                                {/* Invisible element for scrolling to bottom */}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                        {/* Chat Input */}
                        <MessageInput
                            inputRef={inputRef}
                            newMessage={newMessage}
                            setNewMessage={setNewMessage}
                            handleSendMessage={handleSendMessage}
                            handleKeyPress={handleKeyPress}
                        />
                    </div>
                )
            }

        </div>
    );
};
export default MyPurchasedBooksComponent;