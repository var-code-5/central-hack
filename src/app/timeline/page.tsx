import FAQAccordion from '@/components/sections/timeline/faq'
import Time from '@/components/sections/timeline/timeline'
import Image from 'next/image'
import React from 'react'

export default function Timeline() {
    return (
        <div className="min-h-screen bg-black w-screen">
            {/* hero */}
            <div className="w-full min-h-screen flex items-center justify-center bg-[url('/timeline/hero.png')] bg-cover bg-center px-4">
                <div className="bg-black/50 w-full max-w-6xl md:w-3/4 lg:w-1/2 rounded-lg overflow-hidden">
                    <h1 className="text-black text-sm sm:text-base md:text-lg lg:text-xl p-2 bg-c-green font-bold w-full text-left font-jetbrains-mono">
                        Timeline+FAQ.SH
                    </h1>
                    <div className="p-4 sm:p-6 bg-black h-full w-full space-y-4">
                        <div className="flex flex-col items-start gap-4">
                            <Image
                                src="/timeline/yantra.png"
                                alt="Timeline Hero"
                                width={1000}
                                height={1000}
                                className="w-16 sm:w-20 md:w-24 lg:w-32 h-auto flex-shrink-0"
                                priority
                            />
                            <p className="uppercase text-white font-jetbrains-mono font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
                                What does the <br /> <span className="text-c-green">timeline</span> look like?
                            </p>
                        </div>

                        <div className="flex items-center gap-2 w-full">
                            <p className="text-white font-jetbrains-mono text-sm sm:text-base">sw@yantra:~$</p>
                            <div className="w-2 h-5 bg-white transition-all duration-75 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>

            <Time />
            <FAQAccordion />
        </div>
    )
}
