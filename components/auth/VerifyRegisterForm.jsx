"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "antd";
import { maskEmail } from "@/utils/maskEmail";
import CommonBtn from "../common/CommonBtn";
import { useAuth } from "@/hooks/auth.hook";
const VerifyRegisterForm = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [seconds, setSeconds] = useState(25);
    const [resendActive, setResendActive] = useState(false);
    const router = useRouter()
    const { verifyOtp, resendOtp } = useAuth();
    // for checking email in session storage
    useEffect(() => {
        const VERIFY_EMAIL_KEY = process.env.NEXT_PUBLIC_VERIFY_EMAIL_KEY || "verifyEmail";
        const VERIFY_OTP_KEY = process.env.NEXT_PUBLIC_VERIFY_OTP_KEY || "verifyOtp";

        const storedOtp = sessionStorage.getItem(VERIFY_OTP_KEY);
        const verifyEmail = sessionStorage.getItem(VERIFY_EMAIL_KEY);

        if (!verifyEmail) {
            router.push("/auth/signup");
            return;
        }

        setOtp(storedOtp);
        setEmail(verifyEmail);
    }, [router]);
    // otp change handler
    const OtpChange = (val) => {
        setOtp(val);
    };
    // final submit
    const handleSubmit = () => {
        if (otp.length !== 4)
            return toast.error("Please enter a valid 4-digit code");
        verifyOtp.mutate({ otp, email: email });

    };
    // handle resend 
    const handleResend = () => {
        if (!resendActive) return;
        setSeconds(25);
        setResendActive(false);
        resendOtp.mutate({ email: email });
    };
    //   Countdown timer effect
    useEffect(() => {
        let timer;
        if (seconds > 0) {
            timer = setInterval(() => setSeconds((prev) => prev - 1), 1000);
        } else {
            setResendActive(true);
        }
        return () => clearInterval(timer);
    }, [seconds]);

    // otp component
    return (
        <div className="w-full flex flex-col gap-4 justify-start items-center">
            {/* Header */}
            <h5 className="text-center xs:text-xl 3xs:text-lg text-base text-gray-400 font-primary">
                Enter Confirm code sent to your email address <br />
                <span>{maskEmail(email) || "--"}</span>
            </h5>
            {/* Otp */}
            <div className="w-full font-medium flex flex-col gap-3 justify-start items-center">

                {/* 
                <p className="text-red-600 ">***This is for testing purpose only in production this will be removed***</p>
                <p className="text-red-400  font-semibold">Your Verification Code: {otp}</p>
                */}

                <Input.OTP
                    length={4}
                    value={otp}
                    onChange={(val) => OtpChange(val)}
                />
                <CommonBtn
                    type="button"
                    className={`sm:mt-4 mt-2`}
                    isLoading={verifyOtp.isPending}
                    disabled={verifyOtp.isPending || resendOtp.isPending}
                    onclick={handleSubmit}
                >
                    Verify Code
                </CommonBtn>
                {/* resend code */}
                <p className="text-base  text-gray-400 font-primary text-center">
                    Don&apos;t receive the code?{" "}
                    {resendActive ? (
                        <span
                            className="cursor-pointer underline"
                            onClick={handleResend}
                        >
                            Resend
                        </span>
                    ) : (
                        <span>Resend in {seconds} seconds</span>
                    )}
                </p>
            </div>
        </div >
    )
}

export default VerifyRegisterForm