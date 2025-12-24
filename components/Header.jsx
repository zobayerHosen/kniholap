'use client'
import Logo from "./common/Logo"
import NavItems from "./NavItems"
import Link from "next/link"
import LanguageSwitch from "./LanguageSwitch"
import Notifications from "./Notifications";
import GlobalSearch from "./GlobalSearch";
import MobileNavItems from "./MobileNavItems";
import { useUser } from "@/hooks/get-user.hook"
import { PiSignOut } from "react-icons/pi";
import { useAuth } from "@/hooks/auth.hook"
import { useState } from "react"
import ConfirmLogoutModal from "./common/ConfirmLogoutModal"

const Header = () => {
    const { accessToken } = useUser();
    const { logout } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);


    // main render
    return (
        <>
            <header className="w-full sm:py-4 py-2 bg-primary-rgb sticky top-0 z-[1000] backdrop-blur-xl">
                <div className="container flex items-center justify-between">
                    <Logo className="sm:w-44 xl:h-16 xs:w-32 w-28 h-12" />
                    <NavItems />
                    {/* other buttons*/}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* language switch */}
                        <LanguageSwitch className={`sm:flex hidden`} />
                        {/* Notifications */}
                        <Notifications className={`sm:flex hidden`} />
                        {/* search */}
                        <GlobalSearch className={`sm:flex hidden`} />
                        {/* sign in */}
                        {
                            !accessToken ? (
                                <Link href="/auth" prefetch={true} title="Sign In" className="sm:p-2.5 w-10 min-h-10 bg-primary sm:w-28  items-center justify-center gap-2 text-base font-secondary font-medium text-white rounded-lg xl:rounded-3xl capitalize sm:flex hidden">
                                    Sign In
                                </Link>
                            ) : (
                                <button onClick={() => setShowLogoutModal(true)} title="Sign Out" className={"size-10 text-white flex items-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 justify-center text-xl p-2 bg-primary rounded-lg shrink-0"}>
                                    <PiSignOut />
                                </button>
                            )
                        }
                        <MobileNavItems />
                    </div>
                </div>
            </header>

            <ConfirmLogoutModal
                isOpen={showLogoutModal}
                isLoading={logout.isPending}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={() => {
                    logout.mutate(undefined, {
                        onSuccess: () => {
                            setShowLogoutModal(false);
                            window.location.reload()
                        }
                    })
                }}
            />
        </>
    )
};
export default Header;