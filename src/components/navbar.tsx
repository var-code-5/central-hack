'use client';
import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from '@/utils/supabase/client';
import { useDashboardContext } from '@/contexts/DashboardContext';
import { useToast } from '@/components/ui/Toast';

interface DiagonalNavProps {
    userName?: string;
    showDashboardNav?: boolean;
}

const DiagonalNav: React.FC<DiagonalNavProps> = ({ userName, showDashboardNav = false }) => {
    const pathname = usePathname() || "/";
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const supabase = createClient();
    const { dashboardStep } = useDashboardContext();
    const toast = useToast();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsLoggedIn(!!session);
        };
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase]);

    const colorClasses = useMemo(() => {
        if (pathname.startsWith("/problem-statements")) {
            return { bg: "bg-c-purple", border: "border-c-purple", bodyBg: "bg-c-purple" };
        }
        if (pathname.startsWith("/timeline")) {
            return { bg: "bg-c-green", border: "border-c-green", bodyBg: "bg-c-green" };
        }
        if (pathname.startsWith("/login")) {
            return { bg: "bg-[#E5310E]", border: "border-[#E5310E]", bodyBg: "bg-[#E5310E]" };
        }
        if (pathname.startsWith("/dashboard")) {
            // Only show pink when user has team (team-detail step)
            if (dashboardStep === 'team-detail') {
                return { bg: "bg-[#E3495A]", border: "border-[#E3495A]", bodyBg: "bg-[#E3495A]" };
            }
            // Orange for profile and team creation steps
            return { bg: "bg-[#E5310E]", border: "border-[#E5310E]", bodyBg: "bg-[#E5310E]" };
        }
        return { bg: "bg-c-blue", border: "border-c-blue", bodyBg: "bg-c-blue" };
    }, [pathname, dashboardStep]);

    const isDashboard = pathname.startsWith("/dashboard");

    const handleLogout = async () => {
        try {
            await fetch('/auth/logout', { method: 'POST' });
            await supabase.auth.signOut();
            setIsLoggedIn(false);
            router.push('/dashboard'); // Go to dashboard landing instead of login since login redirects
        } catch (error) {
            console.error('Error during logout:', error);
            toast.error('Failed to sign out');
        }
    };

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
        setUserDropdownOpen(false);
    }, [pathname]);

    // Dashboard-style navbar when user has team
    if (showDashboardNav && isDashboard) {
        return (
            <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${scrolled ? 'backdrop-blur-md bg-black/30' : ''}`}>
                <div className="flex items-center h-14 px-4">
                    {/* Logo area */}
                    <div className="flex items-center gap-4 mr-8">
                        <div className="flex -space-x-4">
                            <div className={`h-10 w-28 ${bgClass} clip-path-nav`}></div>
                            <div className={`h-10 w-10 ${bgClass} clip-path-nav-2`}></div>
                            <div className={`h-10 w-10 ${bgClass} clip-path-nav-2`}></div>
                        </div>
                        <span className="font-space-grotesk font-bold text-white text-[13px] md:text-xl uppercase whitespace-nowrap">
                            YANTRA CENTRAL HACK
                        </span>
                    </div>

                    {/* Dashboard Navigation Tabs */}
                    <div className="hidden md:flex font-space-grotesk uppercase font-bold h-full items-center flex-1">
                        <Link
                            href="/dashboard"
                            className={`h-full flex items-center text-white px-6 ${bgClass} hover:opacity-90 transition-opacity`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/"
                            className="h-full flex items-center text-white px-6 bg-[#4A4A5A] hover:bg-[#5A5A6A] transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/problem-statements"
                            className="h-full flex items-center text-white px-6 bg-[#4A4A5A] hover:bg-[#5A5A6A] transition-colors"
                        >
                            Tracks
                        </Link>
                        <Link
                            href="/timeline"
                            className="h-full flex items-center text-white px-6 bg-[#4A4A5A] hover:bg-[#5A5A6A] transition-colors"
                        >
                            Timeline
                        </Link>
                    </div>

                    {/* User Dropdown */}
                    <div className="relative ml-auto">
                        <button
                            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#4A4A5A] hover:bg-[#5A5A6A] transition-colors text-white font-space-grotesk"
                        >
                            <span className="truncate max-w-[120px]">{userName || 'User'}</span>
                            <svg className={`w-4 h-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {userDropdownOpen && (
                            <div className="absolute right-0 top-full mt-1 bg-[#1A1A2E] border border-[#3D3D5C] rounded shadow-lg z-50">
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2 text-left text-white hover:bg-[#E3495A] transition-colors font-jetbrains-mono"
                                >
                                    LOGOUT
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className={`h-1 w-full ${bgClass}`}></div>

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
    }

    return (
        <>
            {/* Full-width backdrop blur layer on scroll */}
            <div 
                className={`fixed top-0 left-0 w-full h-20 z-[99] transition-all duration-300 ease-out ${
                    scrolled ? 'opacity-100 backdrop-blur-md bg-black/40' : 'opacity-0 pointer-events-none'
                }`}
            />
            
            <nav className="fixed top-5 left-[2.5vw] w-full max-w-[95vw] z-[100]">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="flex -space-x-4">
                            <div className={`h-10 w-28 ${bgClass} clip-path-nav`}></div>
                            <div className={`h-10 w-10 ${bgClass} clip-path-nav-2`}></div>
                            <div className={`h-10 w-10 ${bgClass} clip-path-nav-2`}></div>
                        </div>
                        <span className="font-space-grotesk font-bold text-white text-[13px] md:text-xl uppercase whitespace-nowrap">
                            YANTRA CENTRAL HACK
                        </span>
                    </div>

                    {/* Desktop links */}
                    <div className="hidden md:flex font-space-grotesk uppercase font-bold h-10 items-center">
                    <Link href="/" className={`border-x-4 ${borderClass} ${pathname === "/" ? bgClass : ""} h-full flex items-center text-white px-2 hover:opacity-80 transition-opacity`}>Home</Link>
                    <Link href="/problem-statements" className={`${borderClass} ${pathname.startsWith("/problem-statements") ? bgClass : ""} h-full flex items-center text-white px-2 hover:opacity-80 transition-opacity`}>Problem Statements</Link>
                    <Link href="/timeline" className={`border-x-4 ${borderClass} ${pathname.startsWith("/timeline") ? bgClass : ""} h-full flex items-center text-white px-2 hover:opacity-80 transition-opacity`}>Timeline</Link>
                    {isDashboard && isLoggedIn ? ( // Desktop
                        <button
                            onClick={handleLogout}
                            className={`border-r-4 ${borderClass} ${bgClass} h-full flex items-center text-white px-2 hover:opacity-80 transition-opacity`}
                        >
                            LOGOUT
                        </button>
                    ) : (
                        <Link href="/dashboard" className={`border-r-4 ${borderClass} ${pathname.startsWith("/dashboard") || pathname.startsWith("/login") ? bgClass : ""} h-full flex items-center text-white px-2 hover:opacity-80 transition-opacity`}>DASHBOARD</Link>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    aria-label="Toggle navigation"
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                    className={`md:hidden h-8 w-8 flex items-center justify-center rounded border ${borderClass} text-white`}
                >
                    <span className="sr-only mt-1">Menu</span>
                    <div className="space-y-1.5">
                        <span className={`block h-0.5 w-4 ${bgClass}`}></span>
                        <span className={`block h-0.5 w-4 ${bgClass}`}></span>
                        <span className={`block h-0.5 w-4 ${bgClass}`}></span>
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
                    {isDashboard && isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className={`px-4 py-3 ${bgClass} hover:opacity-80 transition-opacity text-left`}
                        >
                            Logout
                        </button>
                    ) : (
                        <Link href="/dashboard" className={`px-4 py-3 ${pathname.startsWith("/dashboard") || pathname.startsWith("/login") ? bgClass : ""} hover:opacity-80 transition-opacity`}>DASHBOARD</Link>
                    )}

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
        </>
    );
};

export default DiagonalNav;
