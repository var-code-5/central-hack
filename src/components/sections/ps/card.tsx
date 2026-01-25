'use client'
import React, { useState } from 'react'

interface PSCardProps {
  number: number;
  description: string;
}

export default function PSCard({ number, description }: PSCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col bg-[url('/ps/ps-bg.png')] bg-cover bg-bottom-right w-full aspect-square p-4 border-l-c-purple border font-space-grotesk">
        <h2 className="text-xl font-bold font-jetbrains-mono text-c-purple">// Problem Statement {number}</h2>
        <p className="text-xl line-clamp-6 text-white mt-4">{description}</p>
        <button
          className="mt-auto text-white px-4 py-2 max-w-[60%] bg-[url('/ps/details.png')] bg-cover bg-bottom-right cursor-pointer"
          onClick={() => setOpen(true)}
        >
          View More
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-lg w-[90%] bg-[#141414] border border-c-purple rounded-lg p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-jetbrains-mono text-c-purple">// Problem Statement {number}</h3>
              <button
                className="text-white/80 hover:text-white cursor-pointer"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="mt-4">
              <p className="text-white text-base whitespace-pre-wrap">{description}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                className="text-white px-4 py-2 border border-white/30 rounded hover:bg-white/10 cursor-pointer"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
