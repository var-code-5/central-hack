import React from 'react';

interface LoaderProps {
    fullScreen?: boolean;
    className?: string;
    message?: string;
}

export function Loader({ fullScreen = true, className = '', message = 'LOADING...' }: LoaderProps) {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0D0A0A] backdrop-blur-sm">
                <div className="relative flex items-center justify-center">
                    <div className="absolute w-24 h-24 rounded-full border-2 border-[#FB3103]/20 animate-ping opacity-20"></div>
                    <div className="w-16 h-16 rounded-full border-2 border-t-[#FB3103] border-r-[#FB3103]/50 border-b-[#FB3103]/20 border-l-transparent animate-spin"></div>
                    <div className="absolute w-10 h-10 rounded-full bg-[#FB3103]/10 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FB3103] animate-pulse shadow-[0_0_10px_#FB3103]"></div>
                    </div>
                </div>

                <div className="mt-8 relative overflow-hidden">
                    <p className="font-jetbrains-mono text-[#FB3103] text-sm tracking-[0.2em] font-bold animate-pulse">
                        {message}
                    </p>
                    <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-[#FB3103]/20 to-transparent animate-[shimmer_2s_infinite]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex items-center justify-center gap-2 ${className}`}>
            <div className="w-4 h-4 rounded-full border-2 border-t-current border-r-current/30 border-b-current/10 border-l-transparent animate-spin"></div>
            {message && <span className="animate-pulse text-xs tracking-wider font-bold">{message}</span>}
        </div>
    );
}
