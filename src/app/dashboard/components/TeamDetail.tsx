'use client';

import React, { useState } from 'react';
import type { User as ProfileUser } from '@/types/profile';
import type { TeamWithDetails } from '@/types/team';

interface TeamDetailProps {
  profileData: ProfileUser;
  teamData: TeamWithDetails;
  user: any;
  onLeaveTeam: () => Promise<void>;
  loading: boolean;
}

export default function TeamDetail({ 
  profileData, 
  teamData, 
  user, 
  onLeaveTeam, 
  loading 
}: TeamDetailProps) {

  const rounds = [
    { 
      id: 1, 
      name: 'Name', 
      description: 'Lacinia elit velit augue dignissim. Adipiscing non enim eget quam interdum neque. Enim cursus euismod eget cras i Lacinia elit velit augue dignissim. Adipiscing non enim eget q...',
      status: 'NOT SUBMITTED',
      canSubmit: true
    },
    { 
      id: 1, 
      name: 'Name', 
      description: 'Lacinia elit velit augue dignissim. Adipiscing non enim eget q...',
      status: 'IN REVIEW',
      canSubmit: false
    },
    { 
      id: 2, 
      name: 'Name', 
      description: 'Elit in ut tempus velit sed velit at nunc.',
      status: 'NOT QUALIFIED',
      canSubmit: false
    },
    { 
      id: 3, 
      name: 'Name', 
      description: 'Elit in ut tempus velit sed velit at nunc.',
      status: 'PASSED',
      canSubmit: false
    },
  ];

  const getStatusBadge = (status: string) => {
    const baseClass = "px-4 py-1.5 text-[10px] font-bold tracking-widest border uppercase text-center min-w-[120px]";
    switch (status) {
      case 'NOT SUBMITTED':
        return <span className={`${baseClass} border-white/10 text-white/20 bg-white/5`}>NOT SUBMITTED</span>;
      case 'IN REVIEW':
        return <span className={`${baseClass} border-[#FEC84B] text-[#FEC84B]`}>IN REVIEW</span>;
      case 'NOT QUALIFIED':
        return <span className={`${baseClass} border-[#DA1204] text-[#DA1204]`}>NOT QUALIFIED</span>;
      case 'PASSED':
        return <span className={`${baseClass} border-[#32D583] text-[#32D583]`}>PASSED</span>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#000000] text-white pt-16 pb-8 px-4 md:px-10 font-sans">
      <div className="flex flex-col lg:flex-row gap-6 max-w-[1400px] mx-auto">
        
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          
          {/* Timeline Section */}
          <div className="bg-[#080808] border border-white/5 p-8 relative">
            <h2 className="text-white font-bold text-xl mb-10 tracking-tight uppercase">THE TIMELINE</h2>
            
            <div className="relative flex items-center justify-between px-2">
              <div className="absolute top-4 left-0 right-0 h-[1px] bg-white/10"></div>
              <div className="absolute top-4 left-0 w-[22%] h-[1px] bg-[#E3495A]"></div>
              
              {[
                { label: 'LABEL', done: true },
                { label: 'ROUND 1', time: '10PM-2AM', current: true },
                { label: 'LABEL' },
                { label: 'LABEL' },
                { label: 'LABEL' }
              ].map((step, i) => (
                <div key={i} className="relative flex flex-col items-center z-10">
                  <div className={`w-8 h-8 flex items-center justify-center border ${step.done ? 'bg-[#E3495A] border-[#E3495A]' : step.current ? 'bg-[#080808] border-[#E3495A]' : 'bg-[#080808] border-white/20'}`}>
                    {step.done && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {step.current && <div className="w-2 h-2 bg-[#E3495A]"></div>}
                  </div>
                  <div className="mt-4 text-center">
                    <p className={`text-[10px] font-bold tracking-widest ${step.current ? 'text-[#E3495A]' : 'text-white/40'}`}>{step.label}</p>
                    {step.time && <p className="text-[10px] text-[#E3495A] font-bold">{step.time}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Round Info Table */}
          <div className="bg-[#080808] border border-white/5">
            <div className="flex items-center justify-between p-6">
              <h2 className="text-white font-bold text-xl uppercase">ROUND INFORMATION</h2>
              <button className="px-4 py-2 bg-[#121212] border border-white/10 text-white/60 text-xs flex items-center gap-3">
                ALL ROUNDS
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>

            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-y border-white/5 text-[10px] font-bold text-white/40 uppercase tracking-widest">
              <div className="col-span-1 flex items-center gap-2">ROUND NO <span className="text-[8px]">⇅</span></div>
              <div className="col-span-5 flex items-center gap-2">ROUND INFO <span className="text-[8px]">⇅</span></div>
              <div className="col-span-3 flex items-center gap-2">STATUS <span className="text-[8px]">⇅</span></div>
              <div className="col-span-3 flex items-center gap-2 text-right">ACTIONS <span className="text-[8px]">⇅</span></div>
            </div>

            {rounds.map((round, index) => (
              <div key={index} className={`grid grid-cols-12 gap-4 px-6 py-6 border-b border-white/5 items-center ${index === 0 ? 'bg-white/[0.02]' : ''}`}>
                <div className="col-span-1 text-sm font-bold text-white/60">{round.id}</div>
                <div className="col-span-5">
                  <p className="font-bold text-white text-base">{round.name}</p>
                  <p className="text-white/40 text-xs mt-1 leading-relaxed line-clamp-2 max-w-sm">{round.description}</p>
                </div>
                <div className="col-span-3">{getStatusBadge(round.status)}</div>
                <div className="col-span-3 flex justify-end">
                  {round.canSubmit ? (
                    <button className="px-6 py-2.5 bg-[#E3495A] text-white text-[11px] font-bold tracking-wider uppercase shadow-lg shadow-[#E3495A]/10">
                      ADD SUBMISSION
                    </button>
                  ) : (
                    <button className="px-10 py-2.5 border border-white/10 text-white text-[11px] font-bold tracking-wider uppercase hover:bg-white/5">
                      VIEW
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-[#080808] border border-white/5 p-6">
            <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-1">CURRENT STATUS</p>
            <h2 className="text-3xl font-bold tracking-tight">ROUND 1</h2>
            <p className="text-[#32D583] text-xs font-bold mt-1 uppercase tracking-widest">QUALIFIED</p>
            
            <div className="mt-8">
              <div className="h-2 bg-[#1A1A1A]">
                <div className="h-full bg-[#503FB8] w-[70%]"></div>
              </div>
              <p className="text-white/40 text-[10px] font-bold mt-2 text-right tracking-widest">01:30:00 LEFT</p>
            </div>
          </div>

          {/* Team Gradient Card */}
          <div className="p-5 relative overflow-hidden" 
               style={{ background: 'linear-gradient(135deg, #B647E5 0%, #F2AA3F 50%, #12AAFF 100%)' }}>
            <div className="relative z-10">
              <p className="text-white/80 text-[10px] font-bold tracking-widest uppercase mb-1">TEAM NAME</p>
              <h3 className="text-lg font-bold text-white mb-4">{teamData.teamName}</h3>
            </div>
            {/* Minimal SVG icons to match reference decoration */}
            <div className="absolute right-2 bottom-2 opacity-40">
               <svg width="60" height="60" viewBox="0 0 100 100" fill="white"><circle cx="80" cy="80" r="15" fill="none" stroke="white" strokeWidth="2" opacity="0.3"/><circle cx="60" cy="60" r="20" fill="none" stroke="white" strokeWidth="2" opacity="0.5"/></svg>
            </div>
          </div>

          <div className="bg-[#080808] border border-white/5 p-5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xs tracking-widest uppercase text-white/80">{teamData.teamName} SMASHERS</h3>
              <button className="text-[10px] font-bold text-white/40 border border-white/10 px-2 py-1 flex items-center gap-2">
                Refresh <span>↻</span>
              </button>
            </div>

            <div className="space-y-4">
              {teamData.teamMembers.map((m, idx) => (
                <div key={idx} className="flex justify-between items-center group">
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-[#E3495A]">{m.name}</p>
                    <p className="text-[10px] text-white/30 font-mono">{m.regNo}</p>
                  </div>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    {m.email === teamData.teamLeader ? 'LEADER' : 'MEMBER'}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={onLeaveTeam}
              className="w-full mt-8 py-2.5 border border-white/10 text-white/40 text-[11px] font-bold tracking-widest uppercase hover:text-[#DA1204] hover:border-[#DA1204] transition-colors"
            >
              LEAVE TEAM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}