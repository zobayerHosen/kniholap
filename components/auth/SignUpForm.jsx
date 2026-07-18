"use client";
import { useForm } from "react-hook-form";
import CommonInputWrapper from "../common/CommonInputWrapper";
import { validatePassword } from "@/utils/validatePassword";
import { useAuth } from "@/hooks/auth.hook";
import { useState } from "react";
import CommonBtn from "../common/CommonBtn";
import ErrorText from "../common/ErrorText";

const SignUpForm = () => {
    const [error, setError] = useState(null);
    // hooks
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const {
        register: registerUser,
    } = useAuth();
    const onSubmit = (data) => {
        registerUser.mutate(data, {
            onSuccess: (res) => {
                setError(null);
            },
            onError: (err) => {
                setError(err?.response?.data?.message || "Something went wrong!");
            },
        });
    }

    // main render 
    return (
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            {/* name */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CommonInputWrapper
                    register={register}
                    errors={errors}
                    type="text"
                    name="first_name"
                    placeholder="Your first name"
                    register_as="first_name"
                    label="First Name:"
                    validationRules={{
                        required: "This field is required",
                    }}
                />
                <CommonInputWrapper
                    register={register}
                    errors={errors}
                    type="text"
                    name="last_name"
                    placeholder="Your last name"
                    register_as="last_name"
                    label="Last Name:"
                    validationRules={{
                        required: "This field is required",
                    }}
                />
            </div>
            {/* email */}
            <CommonInputWrapper
                register={register}
                errors={errors}
                type="email"
                name="email"
                placeholder="Enter your email"
                register_as="email"
                label="Email address:"
                validationRules={{
                    required: "This field is required",
                    pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "Enter a valid email address",
                    },
                }}
            />
            {/* password */}
            <CommonInputWrapper
                register={register}
                errors={errors}
                type="password"
                name="password"
                placeholder="Enter password"
                register_as="password"
                label="Password:"
                validationRules={{
                    required: "This field is required",
                    validate: validatePassword,
                }}
            />
            {/* confirm password */}
            <CommonInputWrapper
                register={register}
                errors={errors}
                type="password"
                name="password_confirmation"
                placeholder="Confirm password"
                register_as="password_confirmation"
                label="Confirm Password:"
                validationRules={{
                    validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                }}
            />
            {/* submit button */}
            <CommonBtn type="submit" className={`sm:mt-4 mt-2`} isLoading={registerUser.isPending} disabled={registerUser.isPending}>
                Sign Up
            </CommonBtn>
            {error && <ErrorText className={`text-lg text-center`} error={error} />}
        </form>
    )
}

export default SignUpForm