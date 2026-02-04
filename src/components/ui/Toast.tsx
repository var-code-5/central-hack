'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toast: {
        success: (message: string) => void;
        error: (message: string) => void;
        info: (message: string) => void;
    };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context.toast;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = {
        success: (message: string) => addToast(message, 'success'),
        error: (message: string) => addToast(message, 'error'),
        info: (message: string) => addToast(message, 'info'),
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`
              pointer-events-auto min-w-[300px] max-w-[400px] p-4 
              border-l-4 font-jetbrains-mono text-sm shadow-lg
              animate-in slide-in-from-right-full fade-in duration-300
              ${t.type === 'success' ? 'bg-[#080808] border-[#32D583] text-white shadow-[#32D583]/10' : ''}
              ${t.type === 'error' ? 'bg-[#080808] border-[#DA1204] text-white shadow-[#DA1204]/10' : ''}
              ${t.type === 'info' ? 'bg-[#080808] border-[#FB3103] text-white shadow-[#FB3103]/10' : ''}
            `}
                    >
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex flex-col gap-1">
                                <span className={`text-xs font-bold tracking-widest uppercase
                  ${t.type === 'success' ? 'text-[#32D583]' : ''}
                  ${t.type === 'error' ? 'text-[#DA1204]' : ''}
                  ${t.type === 'info' ? 'text-[#FB3103]' : ''}
                `}>
                                    {t.type}
                                </span>
                                <p className="text-white/90 leading-relaxed">{t.message}</p>
                            </div>
                            <button
                                onClick={() => removeToast(t.id)}
                                className="text-white/40 hover:text-white transition-colors"
                                aria-label="Close"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6L6 18M6 6L18 18"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
