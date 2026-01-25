'use client';
import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const DiagonalNav: React.FC = () => {
    const pathname = usePathname() || "/";
    const [open, setOpen] = useState(false);

    const colorClasses = useMemo(() => {
        if (pathname.startsWith("/problem-statements")) {
            return { bg: "bg-c-purple", border: "border-c-purple", bodyBg: "bg-c-purple" };
        }
        if (pathname.startsWith("/timeline")) {
            return { bg: "bg-c-green", border: "border-c-green", bodyBg: "bg-c-green" };
        }
        if (pathname.startsWith("/login")) {
            return { bg: "bg-c-red", border: "border-c-red", bodyBg: "bg-c-red" };
        }
        return { bg: "bg-c-blue", border: "border-c-blue", bodyBg: "bg-c-blue" };
    }, [pathname]);

    useEffect(() => {
        document.body.classList.add(colorClasses.bodyBg);
        return () => {
            document.body.classList.remove(colorClasses.bodyBg);
        };
    }, [colorClasses.bodyBg]);

    const bgClass = colorClasses.bg;
    const borderClass = colorClasses.border;

    // Close mobile menu on route change
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <nav className="fixed top-5 left-[2.5vw] w-full max-w-[95vw] z-[100]">
            <div className="flex justify-between items-center">
                <div className="flex -space-x-4">
                    <div className={`h-10 w-28 ${bgClass} clip-path-nav`}></div>
                    <div className={`h-10 w-10 ${bgClass} clip-path-nav-2`}></div>
                    <div className={`h-10 w-10 ${bgClass} clip-path-nav-2`}></div>
                </div>

                {/* Desktop links */}
                <div className="hidden md:flex font-space-grotesk uppercase font-bold h-10 items-center">
                    <Link href="/" className={`border-x-4 ${borderClass} ${pathname === "/" ? bgClass : ""} h-full flex items-center text-white px-2 hover:opacity-80 transition-opacity`}>Home</Link>
                    <Link href="/problem-statements" className={`${borderClass} ${pathname.startsWith("/problem-statements") ? bgClass : ""} h-full flex items-center text-white px-2 hover:opacity-80 transition-opacity`}>Problem Statements</Link>
                    <Link href="/timeline" className={`border-x-4 ${borderClass} ${pathname.startsWith("/timeline") ? bgClass : ""} h-full flex items-center text-white px-2 hover:opacity-80 transition-opacity`}>Timeline</Link>
                    <Link href="/login" className={`border-r-4 ${borderClass} ${pathname.startsWith("/login") ? bgClass : ""} h-full flex items-center text-white px-2 hover:opacity-80 transition-opacity`}>Login</Link>
                </div>

                {/* Mobile hamburger */}
                <button
                    aria-label="Toggle navigation"
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                    className={`md:hidden h-10 w-10 flex items-center justify-center rounded border ${borderClass} text-white`}
                >
                    <span className="sr-only">Menu</span>
                    <div className="space-y-1.5">
                        <span className={`block h-0.5 w-6 ${bgClass}`}></span>
                        <span className={`block h-0.5 w-6 ${bgClass}`}></span>
                        <span className={`block h-0.5 w-6 ${bgClass}`}></span>
                    </div>
                </button>
            </div>

            <div className={`h-2 w-[95vw] ${bgClass}`}></div>

            {/* Mobile menu drawer */}
            <div
                className={`md:hidden transition-all duration-300 overflow-hidden bg-black ${open ? "max-h-60 mt-2" : "max-h-0"}`}
            >
                <div className={`flex flex-col font-space-grotesk uppercase font-bold text-white border ${borderClass} rounded`}>
                    <Link href="/" className={`px-4 py-3 border-b ${borderClass} ${pathname === "/" ? bgClass : ""} hover:opacity-80 transition-opacity`}>Home</Link>
                    <Link href="/problem-statements" className={`px-4 py-3 border-b ${borderClass} ${pathname.startsWith("/problem-statements") ? bgClass : ""} hover:opacity-80 transition-opacity`}>Problem Statements</Link>
                    <Link href="/timeline" className={`px-4 py-3 border-b ${borderClass} ${pathname.startsWith("/timeline") ? bgClass : ""} hover:opacity-80 transition-opacity`}>Timeline</Link>
                    <Link href="/login" className={`px-4 py-3 ${pathname.startsWith("/login") ? bgClass : ""} hover:opacity-80 transition-opacity`}>Login</Link>
                </div>
            </div>

            <style>{`
                .clip-path-nav {
                    clip-path: polygon(0 0, 75% 0, 100% 100%, 0 100%);
                }
                .clip-path-nav-2 {
                    clip-path: polygon(0 0, 35% 0, 100% 100%, 65% 100%);
                }
            `}</style>
        </nav>
    );
};

export default DiagonalNav;
