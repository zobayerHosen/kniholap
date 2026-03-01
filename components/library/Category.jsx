// Category.jsx
'use client'

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import useGetLanguageOptions from "@/hooks/language.hook"
import { Select } from "antd"

const Category = ({ setFilters, filters }) => {
    const { getLanguage } = useGetLanguageOptions()
    const router = useRouter()
    const searchParams = useSearchParams()

    const typeQuery = searchParams.get("type")

    const [selectedType, setSelectedType] = useState("all")
    const [selectedLanguageId, setSelectedLanguageId] = useState(null)

    // Sync type from URL
    useEffect(() => {
        if (typeQuery) {
            setSelectedType(typeQuery)
        } else {
            setSelectedType("all")
        }
    }, [typeQuery])

    // Sync language from parent filters
    useEffect(() => {
        setSelectedLanguageId(filters.language_id ?? null)
    }, [filters.language_id])

    // Push changes up
    useEffect(() => {
        setFilters((prev) => ({
            ...prev,
            type: selectedType === "all" ? null : selectedType,
            language_id: selectedLanguageId,
        }))
    }, [selectedType, selectedLanguageId, setFilters])

    const handleTypeClick = (type) => {
        setSelectedType(type)
        if (type === "all") {
            router.push("/library")
        } else {
            router.push(`/library?type=${type}`)
        }
    }

    const types = [
        { id: "all", name: "All" },
        { id: "ebook", name: "E-Book" },
        { id: "physical", name: "Physical" },
        { id: "premium", name: "Premium" },
    ]

    return (
        <div className="flex items-center flex-wrap gap-3 md:gap-4 my-5">
            {/* Type buttons */}
            {types?.map((type) => (
                <button
                    key={type.id}
                    onClick={() => handleTypeClick(type.id)}
                    className={`px-4 py-2 rounded md:rounded-xl min-w-[100px] md:min-w-[160px] font-semibold transition ${selectedType === type.id
                        ? "bg-primary text-white"
                        : "bg-white text-black shadow-sm"
                        }`}
                >
                    {type.name}
                </button>
            ))}

            {/* Language dropdown */}
            <div className="min-w-[180px] ml-auto md:ml-0">
                <Select
                    placeholder="All Languages"
                    allowClear
                    style={{ width: "100%" }}
                    className="px-4! py-2! bg-white! text-black! shadow-sm! font-semibold!"
                    value={selectedLanguageId}
                    onChange={(value) => {
                        // Convert special string back to null for your filter logic
                        setSelectedLanguageId(value === "all-languages" ? null : value);
                    }}
                    options={[
                        { value: "all-languages", label: "All Languages" },
                        ...(getLanguage?.map((lang) => ({
                            value: lang.id,
                            label: lang.name,
                        })) || []),
                    ]}
                />
            </div>
        </div>
    )
}

export default Category