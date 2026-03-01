"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { getUserProfile } from "@/lib/api/get-user-profile";
import { axiosPrivateClient } from "@/lib/axios.private.client";
import { UserContext } from "@/context";

const ACCESS_TOKEN_KEY = process.env.AUTH_TOKEN_NAME || "kniholap_auth_token";

export default function UserProvider({ children, serverUserData = null, serverAccessToken = null }) {
    //const router = useRouter();
    const axiosInstance = axiosPrivateClient();
    // Use server data as initial state
    const [accessToken, setAccessToken] = useState(() => {
        return serverAccessToken || Cookies.get(ACCESS_TOKEN_KEY) || null;
    });
    // userdata query
    const { data: userData, refetch: userRefetch, isLoading, isFetching } = useQuery({
        queryKey: ["userData", accessToken],
        queryFn: () => getUserProfile(axiosInstance),
        enabled: !!accessToken,
        initialData: serverUserData,
    });
    console.log("User data", userData);
    // isLoggedIn and userRole
    const isLoggedIn = !!userData && !!accessToken;
    // is quiz answered
    const userRole = userData?.role;
    // return context provider
    return (
        <UserContext.Provider
            value={{
                userData,
                userRefetch,
                accessToken,
                setAccessToken,
                userRole,
                isLoggedIn,
                isLoading: !!accessToken && (isFetching || userData === undefined || isLoading),
            }}
        >
            {children}
        </UserContext.Provider>
    );
}
