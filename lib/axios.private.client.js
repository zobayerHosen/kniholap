/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://admin.kniholap.sk";
const ACCESS_TOKEN_KEY = process.env.AUTH_TOKEN_NAME || "kniholap_auth_token";

/**
 * Creates an instance of axios with headers set to the authorization token from cookies
 * and base URL set to the NEXT_PUBLIC_BASE_URL environment variable.
 * If the response status is 401, it removes the authorization token from cookies and redirects to "/auth"
 * @returns {AxiosInstance} An instance of axios with headers and base URL set
 */
export function axiosPrivateClient () {
    const router = useRouter();
    const token = Cookies.get(ACCESS_TOKEN_KEY) || null;
    const instance = axios.create({
        baseURL: `${baseURL}/api`,
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
    });

    instance.interceptors.response.use(
        (res) => res,
        (error) => {
            if (error.response?.status === 401) {
                Cookies.remove(ACCESS_TOKEN_KEY);
                router.push("/auth"); // ✅ safe client redirect
            }
            return Promise.reject(error);
        }
    );

    return instance;
}
