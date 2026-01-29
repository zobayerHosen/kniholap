// components/LanguageSwitch.jsx
"use client";
import { cn } from "@/lib/utils";
import globe from "@/public/icons/globe.png";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const DEFAULT_LANG = "sk";

export default function LanguageSwitch({ className }) {
    const [selectedLanguage, setSelectedLanguage] = useState(DEFAULT_LANG);
    const [isLoading, setIsLoading] = useState(false);
    const initialized = useRef(false);

    // Note: Load saved language
    useEffect(() => {
        const saved = localStorage.getItem("selectedLanguage");

        if (saved === "en" || saved === "sk") {
            setSelectedLanguage(saved);
        } else {
            // 👇 first visit → default Slovak
            localStorage.setItem("selectedLanguage", "sk");

            const domain = window.location.hostname;
            document.cookie = `googtrans=/auto/sk; path=/; domain=${domain}`;
            document.cookie = `googtrans=/auto/sk; path=/`;

            setSelectedLanguage("sk");
        }
    }, []);


    // Note: Initialize Google
    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        window.googleTranslateElementInit = () => {
            if (window.google?.translate) {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: "en",
                        includedLanguages: "en,sk",
                        autoDisplay: false,
                    },
                    "google_translate_element"
                );

                // 👇 auto-switch to Slovak
                const lang = localStorage.getItem("selectedLanguage") || "sk";
                const selectInterval = setInterval(() => {
                    const select = document.querySelector(".goog-te-combo");
                    if (select) {
                        select.value = lang;
                        select.dispatchEvent(new Event("change", { bubbles: true }));
                        clearInterval(selectInterval);
                    }
                }, 300);
            }
        };

        if (!document.getElementById("google-translate-script")) {
            const script = document.createElement("script");
            script.id = "google-translate-script";
            script.src =
                "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);


    // Note: Super reliable language switch (cookie + DOM trigger)
    const changeLanguage = (lang) => {
        setIsLoading(true);
        // Note: Set cookies for google translate
        const domain = window.location.hostname;
        document.cookie = `googtrans=/auto/${lang}; path=/; domain=${domain}`;
        document.cookie = `googtrans=/auto/${lang}; path=/`;

        // Note: Also try to trigger the select if it exists
        setTimeout(() => {
            const select = document.querySelector(".goog-te-combo");
            if (select && select.value !== lang) {
                select.value = lang;
                select.dispatchEvent(new Event("change", { bubbles: true }));
            }
        }, 500);

        // Note: Update state
        setSelectedLanguage(lang);
        localStorage.setItem("selectedLanguage", lang);
        window.location.reload();
    };

    // Note: handler toggle language switch
    const toggleLanguage = () => {
        const next = selectedLanguage === "en" ? "sk" : "en";
        changeLanguage(next);
    };

    // Note: render button
    return (
        <>
            {/* Hidden widget */}
            <div id="google_translate_element" style={{ display: "none" }} />

            {/* Language switcher button */}
            <button
                onClick={toggleLanguage}
                title={`Switch to ${selectedLanguage === "en" ? "Slovak" : "English"}`}
                className={cn(
                    "cursor-pointer flex h-10 w-10 items-center justify-center rounded-lg bg-primary p-2 transition hover:bg-primary/90 shrink-0",
                    className
                )}
                aria-label="Toggle language"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin"></div>
                ) : (
                    <Image
                        className="w-full h-full object-contain"
                        src={globe}
                        alt="globe"
                    />
                )}
            </button>
        </>
    );
};