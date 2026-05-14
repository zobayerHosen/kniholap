import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import { useUser } from "./get-user.hook";
import { useRouter } from "next/navigation";
import axiosPublic from "@/lib/axios.public";

// ------------------- // Constants from env // -------------------
const ACCESS_TOKEN_KEY = process.env.AUTH_TOKEN_NAME || "kniholap_auth_token";
const VERIFY_EMAIL_KEY =
  process.env.NEXT_PUBLIC_VERIFY_EMAIL_KEY || "verifyEmail";
const VERIFY_OTP_KEY = process.env.NEXT_PUBLIC_VERIFY_OTP_KEY || "verifyOtp";
const RESET_EMAIL_KEY = process.env.NEXT_PUBLIC_RESET_EMAIL_KEY || "resetEmail";
const RESET_OTP_KEY = process.env.NEXT_PUBLIC_RESET_OTP_KEY || "resetOtp";
const RESET_TOKEN_KEY = process.env.NEXT_PUBLIC_RESET_TOKEN_KEY || "resetToken";
const DEFAULT_EXPIRE_DAYS = Number(
  process.env.NEXT_PUBLIC_ACCESS_TOKEN_EXPIRE_DAYS || 7
);

export const useAuth = () => {
  const { setAccessToken } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();
  const axiosInstance = axiosPublic();
  // ------------------- // Set auth cookie // -------------------
  const setAuthCookie = (token, expiresInMinutes) => {
    const expiresInDays =
      expiresInMinutes !== undefined && expiresInMinutes > 0
        ? expiresInMinutes / (60 * 24) // use backend value
        : DEFAULT_EXPIRE_DAYS; // fallback to env

    Cookies.set(ACCESS_TOKEN_KEY, token, {
      expires: expiresInDays,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
  };
  // ------------------- // Task after login // -------------------
  const onLogin = (token, expires_in_minutes) => {
    setAuthCookie(token, expires_in_minutes);
    setAccessToken(token);
    router.push("/");
  };
  // ------------------- // Task after logout // -------------------
  const onLogout = () => {
    // Remove the auth token
    Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
    // Get current pathname (works in both App Router & Pages Router)
    // const currentPath = window !== undefined ? window.location.pathname : "";
    // If user is inside /dashboard or any subroute → redirect to /auth
    {
      /** if (currentPath.startsWith("/dashboard")) {
      router.push("/auth");
      } */
    }
    router.push("/auth");
  };
  // ------------------- // Register mutation // -------------------
  const register = useMutation({
    mutationKey: ["register"],
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/register", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Otp sent successfully");
      sessionStorage.setItem(VERIFY_EMAIL_KEY, data?.data?.email);
      // comment this code in production
      sessionStorage.setItem(VERIFY_OTP_KEY, data?.data?.otp);
      router.push("/auth/signup/verify_otp");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });
  // ------------------- // Login mutation // -------------------
  const login = useMutation({
    mutationKey: ["login"],
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/login", data);
      return response?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Logged in successfully");
      // get necessary data from response
      const token = data?.data?.token;
      // pass data to onLogin function
      onLogin(token);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });
  // ------------------- // Google login mutation // -------------------
  const googleMutation = useMutation({
    mutationFn: async (token) => {
      const response = await axiosInstance.post("/google-authentication", {
        token,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Google login successful");
      const isQuizAnswered = data?.data?.is_style_profile;
      const token = data?.data?.chique_auth_token;
      const expiresInMinutes = data?.data?.expires_in_minutes;
      onLogin(token, expiresInMinutes, isQuizAnswered);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });
  // ------------------- // Verify registered user mutation // -------------------
  const verifyOtp = useMutation({
    mutationKey: ["verifyOtp"],
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/register-otp-verify", data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuthCookie(data?.data?.token);
      setAccessToken(data?.data?.token);
      // set a temporary cookie to indicate first-time login for 5 minutes
      Cookies.set("firstTime", "true", {
        path: "/",
        sameSite: "lax",
        expires: 5 / (24 * 60), // 5 minutes in days (js-cookie uses days)
      });

      router.push("/choose_interests");
      sessionStorage.removeItem(VERIFY_EMAIL_KEY);
      sessionStorage.removeItem(VERIFY_OTP_KEY);
      toast.success(data?.message || "User Verified successfully");
      sessionStorage.removeItem(VERIFY_EMAIL_KEY);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "OTP verification failed");
    },
  });
  // ------------------- // Resend OTP mutation // -------------------
  const resendOtp = useMutation({
    mutationKey: ["resendOtp"],
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/forgot-password", data);
      return response.data;
    },
    onSuccess: (res) => {
      toast.success(res?.message || "OTP resent successfully");
      sessionStorage.setItem(VERIFY_OTP_KEY, res?.data?.otp);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });

  // -------- Forgot Password Flow -------- //

  // ------------------- // Forgot password mutation // -------------------//
  const forgotPassword = useMutation({
    mutationKey: ["forgotPassword"],
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/forgot-password", data);
      return response.data;
    },
    onSuccess: (response, variables) => {
      toast.success(response?.message || "Otp sent successfully");
      sessionStorage.setItem(RESET_EMAIL_KEY, variables?.email);
      sessionStorage.setItem(RESET_OTP_KEY, response?.data?.otp);
      router.push("/auth/forgot_password/verify_otp");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send otp");
    },
  });
  // ------------------- // Verify reset OTP mutation // -------------------
  const verifyResetOtp = useMutation({
    mutationKey: ["verifyResetOtp"],
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/verify-otp", data);
      return response.data;
    },
    onSuccess: (res) => {
      toast.success(res?.message || "OTP verified successfully");
      sessionStorage.setItem(RESET_TOKEN_KEY, res?.token);
      sessionStorage.removeItem(RESET_OTP_KEY);
      router.push("/auth/forgot_password/reset_new_password");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });
  // ------------------- // Resend OTP mutation // -------------------
  const resendResetOtp = useMutation({
    mutationKey: ["resendResetOtp"],
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/forgot-password", data);
      return response.data;
    },
    onSuccess: (res) => {
      toast.success(res?.message || "OTP resent successfully");
      sessionStorage.setItem(RESET_OTP_KEY, res?.data?.otp);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
    },
  });
  // ------------------- // Reset new password mutation // -------------------
  const resetNewPassword = useMutation({
    mutationKey: ["resetNewPassword"],
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/reset-password", {
        email: sessionStorage.getItem(RESET_EMAIL_KEY),
        token: sessionStorage.getItem(RESET_TOKEN_KEY),
        ...data,
      });
      return response.data;
    },
    onSuccess: (res) => {
      toast.success(res?.message || "Password reset successfully");
      sessionStorage.removeItem(RESET_TOKEN_KEY);
      sessionStorage.removeItem(RESET_EMAIL_KEY);
      router.push("/auth/forgot_password/success");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong!");
      sessionStorage.removeItem(RESET_TOKEN_KEY);
      sessionStorage.removeItem(RESET_EMAIL_KEY);
      router.push("/auth/sign-in");
    },
  });
  // ------------------- // Logout mutation // -------------------
  const logout = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      try {
        const token = Cookies.get(ACCESS_TOKEN_KEY);
        const response = await axiosInstance.post(
          "/logout",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return response?.data;
      } catch (error) {
        console.error("Logout API error:", error);
        return null;
      }
    },
    onSuccess: (response) => {
      toast.success(response?.message || "Logged out successfully");
      onLogout();
    },
    onError: () => {
      onLogout();
      toast.success("Logged out successfully");
    },
    onSettled: () => {
      queryClient.clear();
      onLogout();
    },
  });
  // ------------------- // Return all auth hooks // -------------------
  return {
    login,
    googleMutation,
    register,
    verifyOtp,
    forgotPassword,
    resendOtp,
    resendResetOtp,
    verifyResetOtp,
    resetNewPassword,
    logout,
    onLogin,
    onLogout,
    setAuthCookie,
  };
};
