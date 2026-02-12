'use client';

import React, { useState } from 'react';
import { useToast } from '@/components/ui/Toast';

interface SubmitPopupProps {
    roundId: number; // 0 for Idea Submission (Round 0), others for Round 1+
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    initialData?: {
        title: string;
        description: string;
        links: string[];
    } | null;
    readonly?: boolean;
}

export default function SubmitPopup({ roundId, isOpen, onClose, onSubmit, initialData, readonly }: SubmitPopupProps) {
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        link1: '',
        link2: '',
        link3: '',
    });

    React.useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                link1: initialData.links?.[0] || '',
                link2: initialData.links?.[1] || '',
                link3: initialData.links?.[2] || '',
            });
        } else if (isOpen) {

            if (!initialData) {
                setFormData({ title: '', description: '', link1: '', link2: '', link3: '' });
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const isRoundZero = roundId === 0;

    const isValidUrl = (url: string) => {
        if (!url) return false;
        try {
            new URL(url);
            return url.startsWith('http://') || url.startsWith('https://');
        } catch (_) {
            return false;
        }
    };

    const handleChange = (field: string, value: string) => {
        if (readonly) return;
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);

        if (isRoundZero && !formData.title.trim()) {
            toast.error("Please enter a title");
            setLoading(false);
            return;
        }


        if (!isRoundZero) {
            if (!formData.link1.trim()) {
                toast.error("Github Link is mandatory");
                setLoading(false);
                return;
            }
            if (!isValidUrl(formData.link1)) {
                toast.error("Invalid Github Link (must start with http:// or https://)");
                setLoading(false);
                return;
            }
            if (formData.link2.trim() && !isValidUrl(formData.link2)) {
                toast.error("Invalid Figma Link");
                setLoading(false);
                return;
            }
            if (formData.link3.trim()) {
                const invalidLink = formData.link3.split(',').find(l => !isValidUrl(l.trim()));
                if (invalidLink) {
                    toast.error(`Invalid link in Other Links: ${invalidLink}`);
                    setLoading(false);
                    return;
                }
            }
        } else {
             if (formData.link1.trim() && !isValidUrl(formData.link1)) {
                toast.error("Invalid Drive Link");
                setLoading(false);
                return;
             }
        }



        try {
            await onSubmit({
                roundId,
                ...formData
            });
            onClose();
        } catch (e) {
            console.error(e);
            toast.error("Failed to submit");
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
                        {readonly 
                            ? 'VIEW SUBMISSION' 
                            : initialData 
                                ? 'EDIT SUBMISSION' 
                                : `SUBMIT ${isRoundZero ? 'IDEA' : 'LINKS'}`
                        }
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
                    {isRoundZero && <div className="space-y-2">
                        <label className="text-[#FB3103] text-xs font-bold tracking-widest uppercase">
                            IDEA TITLE
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            readOnly={readonly}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className={`w-full bg-[#1A0505] border border-[#FB3103]/50 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#FB3103] placeholder-white/20 uppercase ${readonly ? 'opacity-70 cursor-not-allowed' : ''}`}
                            placeholder="IDEA"
                        />
                    </div>}

                    {/* Links Section */}
                    <div className="space-y-4">

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
                                        readOnly={readonly}
                                        onChange={(e) => handleChange('link1', e.target.value)}
                                        className={`w-full bg-[#1A0505] border border-[#FB3103]/50 text-white pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#FB3103] placeholder-white/20 ${readonly ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        placeholder={isRoundZero ? "https://drive.google.com/..." : "https://github.com/..."}
                                    />
                                </div>
                            </div>
                        </div>

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
                                                readOnly={readonly}
                                                onChange={(e) => handleChange('link2', e.target.value)}
                                                className={`w-full bg-[#1A0505] border border-[#FB3103]/50 text-white pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#FB3103] placeholder-white/20 ${readonly ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                placeholder="https://www.figma.com/file/..."
                                            />
                                        </div>
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
                                                readOnly={readonly}
                                                onChange={(e) => handleChange('link3', e.target.value)}
                                                className={`w-full bg-[#1A0505] border border-[#FB3103]/50 text-white pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#FB3103] placeholder-white/20 ${readonly ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                placeholder="https://link1.com, https://link2.com"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}


                    </div>


                    {isRoundZero && <div className="space-y-2">
                        <label className="text-[#FB3103] text-xs font-bold tracking-widest uppercase">
                            IDEA DESCRIPTION
                        </label>
                        <textarea
                            value={formData.description}
                            readOnly={readonly}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={4}
                            className={`w-full bg-[#1A0505] border border-[#FB3103]/50 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#FB3103] placeholder-white/20 uppercase resize-none ${readonly ? 'opacity-70 cursor-not-allowed' : ''}`}
                            placeholder="DESCRIBE YOUR IDEA..."
                        />
                    </div>}

                </div>


                {!readonly && <div className="mt-8">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full py-4 text-white font-bold uppercase tracking-widest text-sm
                     bg-gradient-to-r from-[#E3495A] to-[#FB3103]
                     hover:brightness-110 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (initialData ? 'UPDATING...' : 'SUBMITTING...') : `${initialData ? 'UPDATE' : 'SUBMIT'} ${isRoundZero ? 'IDEA' : 'PROJECT'}`}
                    </button>
                </div>}

            </div>
        </div>
    );
}
