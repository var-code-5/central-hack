'use client';

import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDangerous?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'CONFIRM',
    cancelText = 'CANCEL',
    isDangerous = false,
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#080808] border border-white/10 relative shadow-2xl shadow-[#DA1204]/5 transform transition-all">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/5">
                    <h2 className={`font-space-grotesk text-lg font-bold tracking-widest uppercase ${isDangerous ? 'text-[#DA1204]' : 'text-white'}`}>
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white/40 hover:text-white transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18M6 6L18 18"></path>
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 font-jetbrains-mono">
                    <p className="text-sm text-white/80 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Footer */}
                <div className="p-6 pt-0 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 border border-white/10 text-white/60 text-xs font-bold tracking-widest uppercase hover:bg-white/5 hover:text-white transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 py-3 text-white text-xs font-bold tracking-widest uppercase transition-colors shadow-lg
              ${isDangerous
                                ? 'bg-[#DA1204] hover:bg-[#DA1204]/90 shadow-[#DA1204]/20'
                                : 'bg-white/10 hover:bg-white/20'
                            }
            `}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
