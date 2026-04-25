'use client'

import { axiosPrivateClient } from "@/lib/axios.private.client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

const ToggleComplete = ({ book = {} }) => {
    const axiosInstance = axiosPrivateClient();
    const bookId = book?.id;

    const [isComplete, setIsComplete] = useState(!book?.is_read_completed || false);

    const toggleCompleteMutation = useMutation({
        mutationFn: async (formData) => {
            const response = await axiosInstance.post(
                `/auth/book/completion/store`,
                formData
            );
            return response.data;
        },
        onSuccess: () => {
            setIsComplete((prev) => !prev);
            toast.success("Book status updated");
        },
        onError: (error) => {
            toast.error("Failed to update book status");
            console.log(error);
        }
    });

    const handleToggle = () => {
        if (!bookId) return;

        const formData = new FormData();
        formData.append("book_id", bookId);

        toggleCompleteMutation.mutate(formData);
    };

    return (
        <button
            type="button"
            onClick={handleToggle}
            disabled={toggleCompleteMutation.isPending}
            className={`${isComplete ? "bg-primary" : "bg-secondary"}
                text-white capitalize rounded-sm py-2 lg:py-3 px-2 
                cursor-pointer shrink-0 text-sm lg:text-base lg:px-10
                ${toggleCompleteMutation.isPending ? "opacity-50 cursor-not-allowed" : ""}
            `}
        >
            {toggleCompleteMutation.isPending
                ? "Updating..."
                : isComplete
                    ? "Mark Incomplete"
                    : "Mark Complete"}
        </button>
    );
};

export default ToggleComplete;