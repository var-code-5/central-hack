'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import Marquee from 'react-fast-marquee'
import Link from 'next/link'
import PSCard from '@/components/sections/ps/card'
import { problemStatements } from './data'

const ITEMS_PER_PAGE = 8

export default function page() {
    const [currentPage, setCurrentPage] = useState(1)

    const totalPages = Math.ceil(problemStatements.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const currentStatements = problemStatements.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

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
                        <Link href="/#problems">
                            <button className="bg-c-purple/20 text-white px-4 py-2 border-b-2 border-c-yellow w-full sm:w-auto">
                                Problem Statements
                            </button>
                        </Link>
                        <Link href="/dashboard">
                            <button className="bg-c-purple/20 text-white px-4 py-2 border-b-2 border-c-yellow w-full sm:w-auto">
                                Submit Solution
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* problem Statements */}
            <div className="min-h-screen w-full bg-c-purple/20" id='problems'>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 justify-items-center px-4 sm:px-6 md:px-8 py-10 md:py-16">
                    {currentStatements.map((ps) => (
                        <PSCard key={ps.id} {...ps} />
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 pb-16">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 border border-c-purple text-white font-jetbrains-mono transition-all ${currentPage === 1
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-c-purple/20 cursor-pointer'
                                }`}
                        >
                            &lt; Previous
                        </button>

                        <div className="flex items-center gap-2 font-jetbrains-mono text-white">
                            <span className="text-c-yellow">{currentPage}</span>
                            <span className="text-white/50">/</span>
                            <span>{totalPages}</span>
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 border border-c-purple text-white font-jetbrains-mono transition-all ${currentPage === totalPages
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-c-purple/20 cursor-pointer'
                                }`}
                        >
                            Next &gt;
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
