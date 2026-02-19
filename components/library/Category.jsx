"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const Category = ({ setFilters }) => {

    const router = useRouter();
    // const pathname = usePathname();
    const searchParams = useSearchParams();
    const typeQuery = searchParams.get("type");
    const [selected_type, setSelectedType] = useState("all");

    const types = [
        { id: "all", name: "All" },
        { id: "ebook", name: "E-Book" },
        { id: "physical", name: "Physical" },
        { id: "premium", name: "Premium" },
    ];

    /* Sync state when URL changes */
    useEffect(() => {

        if (typeQuery) {
            setSelectedType(typeQuery);
        } else {
            setSelectedType("all");
        }

    }, [typeQuery]);


    /* Update filters when state changes */
    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            type: selected_type === "all" ? null : selected_type
        }));

    }, [selected_type, setFilters]);

    /* Handle click */
    const handleClick = (type) => {
        setSelectedType(type);

        if (type === "all") {
            router.push("/library");

        } else {
            router.push(`/library?type=${type}`);

        }
    };

    // Note: ui
    return (
        <div className='w-full flex justify-center gap-3 sm:gap-6 flex-wrap'>
            {types?.map(type => (
                <button
                    key={type.id}
                    onClick={() => handleClick(type.id)}
                    className={`
                        px-4 py-2 rounded md:rounded-xl
                        sm:min-w-[100px] md:min-w-[160px]
                        font-semibold transition
                        ${selected_type === type.id
                            ? "bg-primary text-white"
                            : "bg-white text-black shadow-sm"
                        }
                    `}
                >
                    {type?.name}
                </button>
            ))}
        </div>
    );
};
export default Category;