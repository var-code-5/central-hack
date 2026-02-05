'use client'
import React, { useState } from 'react'

interface PSCardProps {
  id: string;
  track: string;
  title: string;
  description: string;
  domain: string;
  type: string;
}

export default function PSCard({ id, track, title, description, domain, type }: PSCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col bg-[url('/ps/ps-bg.png')] bg-cover bg-bottom-right w-full aspect-square p-4 border-l-c-purple border font-space-grotesk relative">
        <h2 className="text-xl font-bold font-jetbrains-mono text-c-purple">//{id}</h2>
        <h3 className="text-lg font-bold text-white mt-1 line-clamp-2 leading-tight">{title}</h3>
        <p className="text-base line-clamp-4 text-white/80 mt-2">{description}</p>
        <button
          className="mt-auto text-white px-4 py-2 max-w-[60%] bg-[url('/ps/details.png')] bg-cover bg-bottom-right cursor-pointer hover:brightness-110 transition-all hover:bg-c-purple/10"
          onClick={() => setOpen(true)}
        >
          View More
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-xl w-[90%] bg-[#141414] border border-c-purple rounded-lg p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold font-jetbrains-mono text-c-purple">//{id}</h3>
                <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded mt-1 inline-block">{track}</span>
              </div>
              <button
                className="text-white/80 hover:text-white cursor-pointer px-2"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <h4 className="text-xl font-bold text-white mb-2">{title}</h4>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs text-black bg-c-purple px-2 py-0.5 rounded font-bold">{type}</span>
              <span className="text-xs text-white border border-white/30 px-2 py-0.5 rounded">{domain}</span>
            </div>

            <div className="mt-4 bg-white/5 p-4 rounded border border-white/10">
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
