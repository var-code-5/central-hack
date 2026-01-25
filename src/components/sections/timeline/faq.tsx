'use client';

import { useEffect, useRef, useState } from 'react';

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        id: '1',
        question: 'What is a hackathon?',
        answer:
            'A hackathon is a timed event where people collaborate to build prototypes or solutions—typically software or hardware—around a theme or set of challenges.',
    },
    {
        id: '2',
        question: 'Who can participate?',
        answer:
            'Anyone interested in building or learning—developers, designers, product thinkers, students, and professionals. Some events may have eligibility rules; check the event page.',
    },
    {
        id: '3',
        question: 'Do I need a team?',
        answer:
            'Teams are recommended but not required. Most hackathons offer team formation channels before and during the event.',
    },
    {
        id: '4',
        question: 'What should I bring?',
        answer:
            'A laptop, charger, optional peripherals, and any tools or datasets you plan to use. If in person, bring ID and anything needed for comfort.',
    },
    {
        id: '5',
        question: 'Can I use existing code or libraries?',
        answer:
            'Yes, unless the rules specify otherwise. Use open-source libraries and your prior work, but disclose what you reused in your submission.',
    },
];

interface FAQAccordionProps {
    items?: FAQItem[];
}

function Collapsible({
    open,
    children,
    duration = 250,
}: {
    open: boolean;
    children: React.ReactNode;
    duration?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const next = el.scrollHeight;
        setHeight(open ? next : 0);
    }, [open, children]);

    useEffect(() => {
        const handle = () => {
            if (ref.current && open) setHeight(ref.current.scrollHeight);
        };
        window.addEventListener('resize', handle);
        return () => window.removeEventListener('resize', handle);
    }, [open]);

    return (
        <div
            style={{
                height,
                transition: `height ${duration}ms ease`,
                overflow: 'hidden',
            }}
            aria-hidden={!open}
        >
            <div
                ref={ref}
                style={{
                    opacity: open ? 1 : 0,
                    transform: `translateY(${open ? 0 : -4}px)`,
                    transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
                }}
            >
                {children}
            </div>
        </div>
    );
}

export default function FAQAccordion({ items = faqData }: FAQAccordionProps) {
    const [expandedId, setExpandedId] = useState<string>('1');

    const toggleExpanded = (id: string) => {
        setExpandedId(expandedId === id ? '' : id);
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-c-green/20 to-black text-white p-8 font-jetbrains-mono">
            <div className="max-w-7xl mx-auto">
                <div className="text-sm text-white mb-6">//TIMELINE.exe</div>

                <h1 className="text-5xl font-bold mb-8">Frequently Asked Questions</h1>

                <div className="space-y-2">
                    {items.map((item) => {
                        const isExpanded = expandedId === item.id;

                        return (
                            <div key={item.id}>
                                <button
                                    onClick={() => toggleExpanded(item.id)}
                                    aria-expanded={isExpanded}
                                    aria-controls={`faq-panel-${item.id}`}
                                    className={`w-full text-left px-4 py-3 transition-colors ${
                                        isExpanded
                                            ? 'bg-c-green text-black'
                                            : 'bg-transparent border border-dashed border-emerald-500/50 text-white hover:border-emerald-500'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-lg font-bold shrink-0 mt-0.5">
                                            {isExpanded ? '✕' : '+'}
                                        </span>
                                        <span className="text-lg font-bold leading-relaxed">{item.question}</span>
                                    </div>
                                </button>

                                <div
                                    id={`faq-panel-${item.id}`}
                                    className="border-l border-r border-b border-dashed border-emerald-500/50 bg-black"
                                >
                                    <Collapsible open={isExpanded} duration={250}>
                                        {item.answer && (
                                            <div className="px-4 py-6 text-gray-300 text-sm leading-relaxed">
                                                {item.answer}
                                            </div>
                                        )}
                                    </Collapsible>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
