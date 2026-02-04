'use client';

import React from 'react';
import Image from 'next/image';

interface CreateTeamProps {
  teamName: string;
  setTeamName: React.Dispatch<React.SetStateAction<string>>;
  teamCode: string;
  setTeamCode: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  onCreateTeam: () => Promise<void>;
  onJoinTeam: () => Promise<void>;
}

export default function CreateTeam({
  teamName,
  setTeamName,
  teamCode,
  setTeamCode,
  loading,
  onCreateTeam,
  onJoinTeam,
}: CreateTeamProps) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-[#0D0A0A] overflow-x-hidden">
      
      {/* ---------------------------------------------------------------------------
          Left Side - Team Card Preview 
      --------------------------------------------------------------------------- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:sticky lg:top-0 lg:h-screen">
        <div className="relative w-full max-w-[450px]">
          <div className="bg-[#E5310E] p-6 md:p-8 aspect-[4/5] flex flex-col rounded-md shadow-2xl shadow-[#E5310E]/10">
            <div className="mb-4">
              <p className="text-xs opacity-70 uppercase font-jetbrains-mono tracking-widest text-white">Your Crew</p>
              <p className="text-2xl md:text-3xl font-bold font-space-grotesk uppercase text-white break-words">
                {teamName || "TEAM NAME"}
              </p>
            </div>
            
            {/* Team Card Image */}
            <div className="flex-1 flex items-center justify-center relative">
              <Image 
                src="/dashboard/team-card-img.svg" 
                alt="Team" 
                width={350} 
                height={280}
                className="w-full max-w-[280px] md:max-w-[350px] opacity-80 object-contain drop-shadow-lg"
                priority
              />
            </div>

            <div className="mt-auto pt-4 border-t border-white/20">
               <p className="text-[10px] text-white opacity-70 font-jetbrains-mono uppercase">
                  {teamCode ? `CODE ENTERED: ${teamCode}` : 'STATUS: PENDING'}
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------------
          Right Side - Team Form 
      --------------------------------------------------------------------------- */}
      <div className="w-full lg:w-1/2 p-6 md:p-12 flex flex-col justify-center min-h-screen">
        <div className="max-w-lg mx-auto w-full">
          <p className="text-[#E5310E] font-jetbrains-mono text-sm mb-2">// SQUAD-SELECTION</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-space-grotesk font-bold text-[#E5310E] mb-8 lg:mb-12">
            JOIN YOUR CREW
          </h1>

          <div className="space-y-8">
            
            {/* Create Team Section */}
            <div>
              <label className="block text-[#E5310E] font-jetbrains-mono text-sm mb-2 uppercase">
                Create a New Team
              </label>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => {
                    setTeamName(e.target.value);
                    if(e.target.value) setTeamCode(''); // Clear code to avoid confusion
                  }}
                  placeholder="ENTER TEAM NAME"
                  className="w-full px-4 py-3 bg-transparent border border-[#3D2A2A] text-white font-jetbrains-mono uppercase focus:outline-none focus:border-[#E5310E] placeholder:text-gray-600 transition-colors"
                />
                <button
                  onClick={onCreateTeam}
                  disabled={loading || !teamName.trim()}
                  className="w-full px-8 py-3 bg-[#B85C5C] text-white font-jetbrains-mono uppercase hover:bg-[#E5310E] transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#B85C5C]"
                >
                  {loading && teamName ? 'Creating...' : 'Create Team'}
                </button>
              </div>
            </div>

            {/* OR Divider */}
            <div className="flex items-center gap-4 opacity-50 py-2">
              <div className="h-px bg-[#3D2A2A] flex-1"></div>
              <p className="text-[#E5310E] font-jetbrains-mono text-xs">OR</p>
              <div className="h-px bg-[#3D2A2A] flex-1"></div>
            </div>

            {/* Join Team Section */}
            <div>
              <label className="block text-[#E5310E] font-jetbrains-mono text-sm mb-2 uppercase">
                Join Via Team Code
              </label>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  value={teamCode}
                  onChange={(e) => {
                    setTeamCode(e.target.value.toUpperCase());
                    if(e.target.value) setTeamName(''); // Clear name to avoid confusion
                  }}
                  placeholder="ENTER CODE"
                  className="w-full px-4 py-3 bg-transparent border border-[#3D2A2A] text-white font-jetbrains-mono uppercase focus:outline-none focus:border-[#E5310E] placeholder:text-gray-600 transition-colors"
                />
                <button
                  onClick={onJoinTeam}
                  disabled={loading || !teamCode.trim()}
                  className="w-full px-8 py-3 bg-transparent border border-[#E5310E] text-[#E5310E] font-jetbrains-mono uppercase hover:bg-[#E5310E] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#E5310E]"
                >
                  {loading && teamCode ? 'Joining...' : 'Join Team'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}