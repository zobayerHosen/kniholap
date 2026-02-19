"use client";

import { useRouter } from "next/navigation";
import NavLink from "./common/NavLink";
import { useUser } from "@/hooks/get-user.hook";

const NavItems = () => {
    const router = useRouter();
    const { accessToken } = useUser();

    const onNavigate = (value) => {
        router.push(`/library?type=${value}`);
    };

    const navItems = [];

    if (accessToken) {
        navItems.push({ name: "Dashboard", link: "/dashboard", end: false });
        navItems.push({ name: "Bookmark", link: "/bookmark", end: false });
    }

    navItems.push({ name: "Library", link: "/library", end: true });

    // Note: ui
    return (
        <nav className="hidden xl:flex items-center gap-10">

            {navItems.map((item, index) => (
                <NavLink
                    key={index}
                    href={item.link}
                    end={item.end}
                    activeClassName="text-primary"
                >
                    {item.name}
                </NavLink>
            ))}

            {/* Type navigation */}
            <button
                onClick={() => onNavigate("premium")}
                className="hover:text-primary cursor-pointer transition"
            >
                Premium
            </button>

            <button
                onClick={() => onNavigate("ebook")}
                className="hover:text-primary cursor-pointer transition"
            >
                Ebooks
            </button>

            <button
                onClick={() => onNavigate("physical")}
                className="hover:text-primary cursor-pointer transition"
            >
                Physical Books
            </button>

        </nav>
    );
};

export default NavItems;
