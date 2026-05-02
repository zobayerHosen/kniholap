"use client"
import { FcGoogle } from "react-icons/fc";
import { useGoogleSocialLogin } from "@/hooks/useGoogleSocialLogin";

const GoogleLogin = () => {
    const { googleLogin, isPending } = useGoogleSocialLogin();

    // main render
    return (
        <button
            type="button"
            onClick={() => googleLogin()}
            disabled={isPending}
            className={`w-full cursor-pointer rounded-full py-4 px-3 bg-[#DADAD1] flex items-center justify-center gap-1 transition-opacity duration-200 ${isPending ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
                }`}
        >
            <FcGoogle size={20} />
            <span>{isPending ? "Signing In..." : "Sign In with Google"}</span>
        </button>
    )
}

export default GoogleLogin