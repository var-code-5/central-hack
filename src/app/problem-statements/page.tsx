import Image from 'next/image'
import React from 'react'
import Marquee from 'react-fast-marquee'
import Link from 'next/link'
import PSCard from '@/components/sections/ps/card'
import { problemStatements } from './data'

export default function page() {
    return (
        <div className="min-h-screen bg-black w-screen">
            {/* hero */}
            <div className="relative h-screen w-full bg-c-purple/20 overflow-hidden">
                <Image
                    src="/ps/hero-l.png"
                    alt="bitcoin on left"
                    width={800}
                    height={800}
                    priority
                    className="absolute left-0 top-6 md:top-0 h-[30vh] md:h-[70vh] w-auto z-10 pointer-events-none select-none"
                />
                <Image
                    src="/ps/hero-r.png"
                    alt="bitcoin on right"
                    width={800}
                    height={800}
                    priority
                    className="absolute bottom-0 right-0 h-[30vh] md:h-[70vh] w-auto z-0 pointer-events-none select-none"
                />
                <div className="absolute bottom-0 text-c-purple font-jetbrains-mono w-full border-t-2 pt-2">
                    <Marquee className="w-full text-base sm:text-lg md:text-2xl font-bold" speed={40} gradient={false} autoFill>
                        <p className="pl-2">//Think. Build. Disrupt.</p>
                    </Marquee>
                </div>
                <div className="h-full w-full flex flex-col gap-4 justify-center items-center text-center px-4 z-20 relative font-jetbrains-mono">
                    <p className="uppercase text-c-purple text-sm sm:text-base md:text-2xl">//the theme</p>
                    <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-c-purple max-w-5xl">
                        "<span className="text-white">Leveraging Web3 for</span> Social Responsibility"
                    </h1>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-base sm:text-lg md:text-xl">
                        <Link href="/#">
                            <button className="bg-c-purple/20 text-white px-4 py-2 border-b-2 border-c-yellow w-full sm:w-auto">
                                Problem Statements
                            </button>
                        </Link>
                        <Link href="/#">
                            <button className="bg-c-purple/20 text-white px-4 py-2 border-b-2 border-c-yellow w-full sm:w-auto">
                                Submit Solution
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* problem Statements */}
            <div className="min-h-screen w-full bg-c-purple/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 justify-items-center px-4 sm:px-6 md:px-8 py-10 md:py-16">
                    {problemStatements.map((ps) => (
                        <PSCard key={ps.number} {...ps} />
                    ))}
                </div>
            </div>
        </div>
    )
}
