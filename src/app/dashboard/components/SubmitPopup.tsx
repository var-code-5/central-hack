'use client';

import React, { useState } from 'react';

interface SubmitPopupProps {
    roundId: number; // 0 for Idea Submission (Round 0), others for Round 1+
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
}

export default function SubmitPopup({ roundId, isOpen, onClose, onSubmit }: SubmitPopupProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        link1: '', // Drive (R0) or Github (R1+)
        link2: '', // Figma (R1+)
        link3: '', // Other (R1+)
    });

    if (!isOpen) return null;

    const isRoundZero = roundId === 0;

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        // Simple validation
        if (!formData.title.trim()) {
            alert("Please enter a title");
            setLoading(false);
            return;
        }

        // For Round 1+, Github (link1) is mandatory
        if (!isRoundZero && !formData.link1.trim()) {
            alert("Github Link is mandatory");
            setLoading(false);
            return;
        }

        // For Round 0, Drive (link1) is expected (user said "get input as Drive Link", 
        // referencing the image which has multiple link slots, but text was specific.
        // I will use link1 as primary link slot)

        try {
            await onSubmit({
                roundId,
                ...formData
            });
            onClose();
        } catch (e) {
            console.error(e);
            alert("Failed to submit");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-black border border-[#FB3103] p-6 relative shadow-[0_0_30px_rgba(251,49,3,0.15)]">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-white font-space-grotesk text-lg tracking-widest uppercase">
                        SUBMIT {isRoundZero ? 'IDEA' : 'PROJECT'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-[#FB3103] transition-colors"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-6 font-jetbrains-mono">

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-[#FB3103] text-xs font-bold tracking-widest uppercase">
                            {isRoundZero ? 'IDEA TITLE' : 'PROJECT TITLE'}
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className="w-full bg-[#1A0505] border border-[#FB3103]/50 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#FB3103] placeholder-white/20 uppercase"
                            placeholder={isRoundZero ? "REDDY'S HACKERS" : "PROJECT NAME"}
                        />
                    </div>

                    {/* Links Section */}
                    <div className="space-y-4">
                        {/* Link 1: Drive (R0) or Github (R1+) */}
                        <div className="space-y-2">
                            <label className="text-[#FB3103] text-xs font-bold tracking-widest uppercase">
                                {isRoundZero ? 'DRIVE LINK' : 'GITHUB LINK (MANDATORY)'}
                            </label>
                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FB3103]">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.link1}
                                        onChange={(e) => handleChange('link1', e.target.value)}
                                        className="w-full bg-[#1A0505] border border-[#FB3103]/50 text-white pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#FB3103] placeholder-white/20"
                                        placeholder="https://..."
                                    />
                                </div>
                                {/* Decorative 'Save Link' as per image, though functionality merged into Submit */}
                                <button className="text-[#FB3103] text-xs font-bold uppercase hover:text-white transition-colors whitespace-nowrap hidden sm:block">
                                    Save Link
                                </button>
                            </div>
                        </div>

                        {/* Additional Links for Round 1+ */}
                        {!isRoundZero && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-[#FB3103] text-xs font-bold tracking-widest uppercase">
                                        FIGMA LINK
                                    </label>
                                    <div className="flex gap-4">
                                        <div className="relative flex-1">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FB3103]">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.link2}
                                                onChange={(e) => handleChange('link2', e.target.value)}
                                                className="w-full bg-[#1A0505] border border-[#FB3103]/50 text-white pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#FB3103] placeholder-white/20"
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <button className="text-[#FB3103] text-xs font-bold uppercase hover:text-white transition-colors whitespace-nowrap hidden sm:block">
                                            Save Link
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[#FB3103] text-xs font-bold tracking-widest uppercase">
                                        OTHER LINKS (COMMA SEPARATED)
                                    </label>
                                    <div className="flex gap-4">
                                        <div className="relative flex-1">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FB3103]">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.link3}
                                                onChange={(e) => handleChange('link3', e.target.value)}
                                                className="w-full bg-[#1A0505] border border-[#FB3103]/50 text-white pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#FB3103] placeholder-white/20"
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <button className="text-[#FB3103] text-xs font-bold uppercase hover:text-white transition-colors whitespace-nowrap hidden sm:block">
                                            Save Link
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* If Round 0, maybe show extra link slots just to match image if user insists, 
                but requirements said "input as Drive Link". 
                The image shows 3 link slots. I'll stick to 1 for R0 based on text description unless user complains.
                Correction: Image shows "Add Link" 3 times. 
                User text: "For round-0 Idea Submission get the input as Drive Link"
                I will stick to 1 link slot for R0 to follow specific instructions over generic image. 
                Wait, user said "It should be like... attached popup", but described R0 specific fields.
                I'll follow the text description for R0 (just Drive Link) but keep sizing consistent.
             */}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-[#FB3103] text-xs font-bold tracking-widest uppercase">
                            {isRoundZero ? 'IDEA DESCRIPTION' : 'PROJECT DESCRIPTION'}
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={4}
                            className="w-full bg-[#1A0505] border border-[#FB3103]/50 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#FB3103] placeholder-white/20 uppercase resize-none"
                            placeholder={isRoundZero ? "REDDY'S HACKERS" : "DESCRIBE YOUR PROJECT..."}
                        />
                    </div>

                </div>

                {/* Submit Button */}
                <div className="mt-8">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full py-4 text-white font-bold uppercase tracking-widest text-sm
                     bg-gradient-to-r from-[#E3495A] to-[#FB3103]
                     hover:brightness-110 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'SUBMITTING...' : `SUBMIT ${isRoundZero ? 'IDEA' : 'PROJECT'}`}
                    </button>
                </div>

            </div>
        </div>
    );
}
