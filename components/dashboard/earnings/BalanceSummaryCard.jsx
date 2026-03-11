"use client";
const BalanceSummaryCard = ({ item = {} }) => {
    const { id, amount, balanceText } = item;

    // Note: ui card box
    return (
        <div className="w-full flex flex-col gap-3 items-start bg-white p-4 lg:p-6 shadow rounded-3xl hover:scale-95 hover:shadow-md transition-all duration-300 ease-in-out">
            {/* amount */}
            <span className="text-2xl sm:text-xl lg:text-2xl xl:text-3xl text-[#0A0910] font-medium">
                €{amount || "0"}
            </span>

            {/* balance text */}
            <p className="text-lg sm:text-base lg:text-lg xl:text-xl text-[#0A0910] font-normal">{balanceText || "N/F"}</p>
        </div>
    );
};
export default BalanceSummaryCard;