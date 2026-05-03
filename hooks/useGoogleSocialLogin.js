"use client"

import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import axiosPublic from "@/lib/axios.public";
import { useAuth } from "./auth.hook";

/**
 * Custom hook for Google Social Login.
 * Handles the Google OAuth flow and communicates with the backend.
 */
export const useGoogleSocialLogin = () => {
    const { onLogin } = useAuth();
    const axiosInstance = axiosPublic();

    // Mutation to send the Google token and provider to the server
    const socialLoginMutation = useMutation({
        mutationKey: ["googleSocialLogin"],
        mutationFn: async (payload) => {
            // The server expects { token, provider }
            const response = await axiosInstance.post("/social/signin", payload);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Google login successful");
            
            // Adjust these based on your specific backend response structure
            const token = data?.data?.token || data?.token;
            const expiresInMinutes = data?.data?.expires_in_minutes;
            
            if (token) {
                onLogin(token, expiresInMinutes);
            } else {
                console.error("Token missing in response:", data);
            }
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Social login failed. Please try again.");
            console.error("Social login error:", err);
        },
    });

    // Google OAuth login handler
    const googleLogin = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            // Trigger the mutation with the access token from Google
            socialLoginMutation.mutate({
                token: tokenResponse.access_token,
                provider: "google",
            });
        },
        onError: (error) => {
            console.error("Google OAuth error:", error);
            toast.error("Google login failed during authorization.");
        },
    });

    return {
        googleLogin,
        isPending: socialLoginMutation.isPending,
    };
};
