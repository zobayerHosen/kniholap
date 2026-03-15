"use client";
import BankInformationForm from "./bank-information-form";
import OthersInformationForm from "./others-information-form";

const SettingsComponent = () => {


    return (
        <div className="w-full">
            {/* top section content */}
            <div className="w-full flex flex-col gap-2 ">
                <h4 className="text-3xl text-black font-semibold">Stripe Slovakia Account Setup</h4>
                <p className="text-base">Complete your identity and banking details to activate payouts.</p>
            </div>

            <div className="w-full grid lg:grid-cols-2 gap-6 mt-10">
                <OthersInformationForm />
                <BankInformationForm />
            </div>
        </div>
    );
};

export default SettingsComponent;