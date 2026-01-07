"use client";
import CommonInputWrapper from "@/components/common/CommonInputWrapper";
import { useUser } from "@/hooks/get-user.hook";
import { axiosPrivateClient } from "@/lib/axios.private.client";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const PersonalInfrmationForm = () => {
    const { userData, userRefetch } = useUser()
    const axiosSecure = axiosPrivateClient();

    // Note: react hook form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // Note: handle personal information change
    const hanldePersonalInfoChange = useMutation({
        mutationFn: async (formData) => {
            const response = await axiosSecure.post("/user/details/update", formData);
            return response?.data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Personal info updated successfully");
            userRefetch();
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Error updating personal info");
        }
    });

    // Note: form submit
    const handleSubmitForm = (data) => {
        hanldePersonalInfoChange.mutate(data);
    };

    // Note: ui form
    return (
        <div className="w-full bg-white rounded-3xl xl:p-8 lg:p-7 md:p-6 p-4 shadow-md">
            <h3 className="xl:text-3xl lg:text-2xl md:text-xl text-lg text-black font-semibold pb-5">Personal Information</h3>
            <form
                onSubmit={handleSubmit(handleSubmitForm)}
                className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
            >
                {/* First name */}
                <CommonInputWrapper
                    register={register}
                    errors={errors}
                    type="text"
                    name="first_name"
                    placeholder="First name"
                    register_as="first_name"
                    value={userData?.first_name}
                    label="First Name:"
                    validationRules={{
                        required: "This field is required",
                    }}

                />
                {/* Last name */}
                <CommonInputWrapper
                    register={register}
                    errors={errors}
                    type="text"
                    name="last_name"
                    placeholder="Last name"
                    register_as="last_name"
                    value={userData?.last_name}
                    label="Last Name:"
                    validationRules={{
                        required: "This field is required",
                    }}
                />

                {/* email */}
                <div className="md:col-span-2">
                    <CommonInputWrapper
                        register={register}
                        errors={errors}
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        register_as="email"
                        label="Email address:"
                        value={userData?.email}
                        validationRules={{
                            required: "Email field is required",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                message: "Enter a valid email address",
                            },
                        }}
                    />
                </div>

                {/* house, Road, and city */}
                <div className="md:col-span-2">
                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* house input field */}
                        <CommonInputWrapper
                            register={register}
                            errors={errors}
                            type="text"
                            name="house"
                            placeholder="House"
                            register_as="house"
                            value={userData?.house}
                            label="House:"
                            validationRules={{
                                required: "This field is required",
                            }}
                        />
                        {/* road input field */}
                        <CommonInputWrapper
                            register={register}
                            errors={errors}
                            type="text"
                            name="road"
                            placeholder="Road"
                            register_as="road"
                            value={userData?.road}
                            label="Road:"
                            validationRules={{
                                required: "This field is required",
                            }}
                        />
                        {/* city input field */}
                        <CommonInputWrapper
                            register={register}
                            errors={errors}
                            type="text"
                            name="city"
                            placeholder="City"
                            register_as="city"
                            value={userData?.city}
                            label="City:"
                            validationRules={{
                                required: "This field is required",
                            }}
                        />
                    </div>
                </div>

                {/* save button */}
                <button
                    type="submit"
                    disabled={hanldePersonalInfoChange.isPending}
                    className="md:col-span-2 w-full cursor-pointer bg-[#F84E12] text-white px-5 py-2 rounded-lg mt-3"
                >
                    {hanldePersonalInfoChange.isPending ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
};
export default PersonalInfrmationForm;