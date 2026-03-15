"use client";
import CommonInputWrapper from "@/components/common/CommonInputWrapper";
import { useForm } from "react-hook-form";

const BankInformationForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 bg-[#F6F2EF] shadow-2xl border border-gray-300 md:p-8 p-4 rounded-xl h-fit" >
            <h3 className="text-base font-semibold tracking-widest text-gray-600 uppercase">
                Bank Account (SEPA)
            </h3>
            <div className="grid md:grid-cols-2 gap-5">
                {/* IBAN */}
                <div className="md:col-span-2">
                    <CommonInputWrapper
                        register={register}
                        errors={errors}
                        name="iban"
                        register_as="iban"
                        label="Bank IBAN"
                        placeholder="SK68 0900 0000 0000 0000 0000"
                        validationRules={{ required: "Bank IBAN is required" }}
                    />
                </div>

                {/* BIC */}
                <CommonInputWrapper
                    register={register}
                    errors={errors}
                    name="bic"
                    register_as="bic"
                    label="Bank BIC / SWIFT"
                    placeholder="SUBASKBX"
                    validationRules={{ required: "Bank BIC / SWIFT is required" }}
                />

                {/* Account Holder */}
                <CommonInputWrapper
                    register={register}
                    errors={errors}
                    name="account_holder_name"
                    register_as="account_holder_name"
                    label="Account Holder Name"
                    placeholder="John Doe"
                    validationRules={{ required: "Account Holder Name is required" }}
                />
            </div>

            {/* SUBMIT */}
            <button
                type="submit"
                className="cursor-pointer w-full bg-[#F84E12] text-white py-3 rounded-lg font-semibold mt-4 hover:bg-[#b44319ef] transition-all duration-300"
            >
                Submit Account
            </button>
        </form >
    );
};
export default BankInformationForm;