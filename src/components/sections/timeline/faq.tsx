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
        question: 'Is the hackathon free to attend?',
        answer: 'Yes, the hackathon is completely free to attend. There is no registration fee.',
    },
    {
        id: '2',
        question: 'How many team members are allowed?',
        answer:
            'Each team must have 3-5 members. At least one woman team member is mandatory in every team.',
    },
    {
        id: '3',
        question: "I don't have much coding experience. Can I still participate?",
        answer:
            'Absolutely! Hackathons are about learning, building, and collaborating. Participants from all skill levels are welcome.',
    },
    {
        id: '4',
        question: 'What should we bring to the hackathon?',
        answer:
            'Participants should bring their laptops, chargers, and student ID. Internet access and basic facilities will be provided.',
    },
    {
        id: '5',
        question: 'Will hardware components be provided for Hardware tracks?',
        answer:
            'Based on the requirement and availability, your required hardware components will be provided.',
    },
    {
        id: '6',
        question: 'Are there any theme restrictions?',
        answer:
            'Yes, projects must align with the announced tracks and problem statements. Detailed guidelines will be shared before the event.',
    },
    {
        id: '7',
        question: 'Will participants get OD?',
        answer: 'Yes, participants will get OD throughout the event.However, OD will not be provided for weekend classes',
    },
    {
        id: '8',
        question: 'Have any more queries?',
        answer: 'If you have any further doubts, feel free to ask your questions on our email yantra.sw@vit.ac.in',
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
