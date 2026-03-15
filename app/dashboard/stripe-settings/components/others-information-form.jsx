"use client";

import CommonInputWrapper from "@/components/common/CommonInputWrapper";
import { useUser } from "@/hooks/get-user.hook";
import { useForm } from "react-hook-form";

const OthersInformationForm = () => {
    const { userData, userRefetch } = useUser()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8 bg-[#F6F2EF] shadow-2xl border border-gray-300 md:p-8 p-4 rounded-xl"
        >
            {/* PERSONAL INFORMATION */}
            <div className="flex flex-col gap-5">

                <h3 className="text-base font-semibold tracking-widest text-gray-600 uppercase">
                    Personal Information
                </h3>

                <div className="grid md:grid-cols-2 gap-5">
                    {/* first name */}
                    <CommonInputWrapper
                        register={register}
                        errors={errors}
                        name="first_name"
                        register_as="first_name"
                        value={userData?.first_name}
                        label="First Name"
                        placeholder="John"
                        validationRules={{ required: "Required" }}
                    />
                    {/* last name */}
                    <CommonInputWrapper
                        register={register}
                        errors={errors}
                        name="last_name"
                        register_as="last_name"
                        value={userData?.last_name}
                        label="Last Name"
                        placeholder="Doe"
                        validationRules={{ required: "Required" }}
                    />
                    {/* email */}
                    <CommonInputWrapper
                        register={register}
                        errors={errors}
                        name="email"
                        register_as="email"
                        value={userData?.email}
                        label="Email"
                        readOnly
                        disabled={true}
                        placeholder="john@example.com"
                    />

                    {/* DOB */}
                    {/* <div className="grid grid-cols-3 gap-4 md:col-span-2">

                                <CommonInputWrapper
                                    register={register}
                                    errors={errors}
                                    name="dob_day"
                                    register_as="dob_day"
                                    placeholder="Day"
                                    label="Day"
                                    validationRules={{ required: "Required" }}
                                />

                                <CommonInputWrapper
                                    register={register}
                                    errors={errors}
                                    name="dob_month"
                                    register_as="dob_month"
                                    placeholder="Month"
                                    label="Month"
                                    validationRules={{ required: "Required" }}
                                />

                                <CommonInputWrapper
                                    register={register}
                                    errors={errors}
                                    name="dob_year"
                                    register_as="dob_year"
                                    placeholder="Year"
                                    label="Year"
                                    validationRules={{ required: "Required" }}
                                />

                            </div> */}

                    {/* Date of Birth  */}
                    <CommonInputWrapper
                        register={register}
                        errors={errors}
                        type="date"
                        name="date_of_birth"
                        placeholder="Date of Birth"
                        register_as="date_of_birth"
                        value={userData?.date_of_birth}
                        label="Date of Birth:"
                        validationRules={{
                            required: "This field is required",
                        }}
                    />
                    {/* Phone */}
                    <CommonInputWrapper
                        register={register}
                        errors={errors}
                        name="phone"
                        register_as="phone"
                        value={userData?.phone}
                        label="Phone"
                        placeholder="+421 900 000 000"
                        validationRules={{ required: "Required" }}
                    />
                </div>
            </div>

            <hr className="border-dashed border-gray-300" />

            {/* ADDRESS */}
            <div className="flex flex-col gap-5">

                <h3 className="text-base font-semibold tracking-widest text-gray-600 uppercase">
                    Address
                </h3>

                <div className="grid md:grid-cols-2 gap-5">
                    {/* address */}
                    <div className="md:col-span-2">
                        <CommonInputWrapper
                            register={register}
                            errors={errors}
                            name="address"
                            register_as="address"
                            label="Address Line"
                            placeholder="Hlavná 1"
                            validationRules={{ required: "Required" }}
                        />
                    </div>
                    {/* city */}
                    <CommonInputWrapper
                        register={register}
                        errors={errors}
                        name="city"
                        register_as="city"
                        value={userData?.city}
                        label="City"
                        placeholder="Bratislava"
                        validationRules={{ required: "Required" }}
                    />
                    {/* postal code */}
                    <CommonInputWrapper
                        register={register}
                        errors={errors}
                        name="postal_code"
                        register_as="postal_code"
                        label="Postal Code"
                        value={userData?.postal_code}
                        placeholder="811 01"
                        validationRules={{ required: "Required" }}
                    />

                </div>
            </div>

            <hr className="border-dashed border-gray-300" />

            {/* IDENTITY VERIFICATION */}
            <div className="flex flex-col gap-5">
                <h3 className="text-base font-semibold tracking-widest text-gray-600 uppercase">
                    Identity Verification
                </h3>

                <div className="grid md:grid-cols-2 gap-6">

                    {/* Front ID */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">
                            Government ID Front *
                        </label>

                        <label className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition">

                            <div className="bg-[#F84E12]/10 p-3 rounded-md">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-[#F84E12]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12v9m0-9l-3 3m3-3l3 3m0-10H9m6 0h2a2 2 0 012 2v2" />
                                </svg>
                            </div>

                            <p className="text-sm font-semibold text-[#F84E12]">
                                Upload Front Side
                            </p>

                            <p className="text-xs text-gray-500">
                                JPG, PNG or PDF
                            </p>

                            <input
                                type="file"
                                {...register("government_id_front")}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Back ID */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">
                            Government ID Back *
                        </label>

                        <label className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition">

                            <div className="bg-[#F84E12]/10 p-3 rounded-md">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-[#F84E12]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12v9m0-9l-3 3m3-3l3 3m0-10H9m6 0h2a2 2 0 012 2v2" />
                                </svg>
                            </div>

                            <p className="text-sm font-semibold text-[#F84E12]">
                                Upload Back Side
                            </p>

                            <p className="text-xs text-gray-500">
                                JPG, PNG or PDF
                            </p>

                            <input
                                type="file"
                                {...register("government_id_back")}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>
            </div>

            <hr className="border-dashed border-gray-300" />

            {/* SUBMIT */}
            <button
                type="submit"
                className="cursor-pointer w-full bg-[#F84E12] text-white py-3 rounded-lg font-semibold mt-4 hover:bg-[#b44319ef] transition-all duration-300"
            >
                Submit Informations
            </button>

        </form>
    );
};

export default OthersInformationForm;