'use client';

import React, { useState, useEffect } from 'react';
import type { User as ProfileUser } from '@/types/profile';
import type { TeamWithDetails } from '@/types/team';
import SubmitPopup from './SubmitPopup';
import { problemStatements } from '../../problem-statements/data';
import { useToast } from '@/components/ui/Toast';

interface TeamDetailProps {
  profileData: ProfileUser;
  teamData: TeamWithDetails;
  user: any;
  onLeaveTeam: () => Promise<void>;
  loading: boolean;
  token: string;
}

export default function TeamDetail({
  profileData,
  teamData,
  user,
  onLeaveTeam,
  loading,
  token
}: TeamDetailProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [activeRoundId, setActiveRoundId] = useState<number>(0);
  const [globalRoundStatus, setGlobalRoundStatus] = useState<Record<string, string>>({});
  const [psCodeInput, setPsCodeInput] = useState('');
  const [isSubmittingPs, setIsSubmittingPs] = useState(false);
  const [popupInitialData, setPopupInitialData] = useState<any>(null);
  const [isFetchingSubmission, setIsFetchingSubmission] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchRoundStatus = async () => {
      try {
        const res = await fetch('/api/round');
        if (res.ok) {
          const data = await res.json();
          if (data.rounds) {
            setGlobalRoundStatus(data.rounds);
          }
        }
      } catch (e) {
        console.error("Failed to fetch round status", e);
        // Silent failure for background fetch is usually okay, but if critical:
        // toast.error("Failed to load round status");
      }
    };
    fetchRoundStatus();
  }, []);

  const getTeamRoundStatus = (roundId: number) => {
    const key = `round${roundId}Status` as keyof TeamWithDetails;
    return (teamData[key] as string) || 'LOCKED';
  };

  const rounds = [
    {
      id: 0,
      name: 'Idea Submission',
      description: 'Submit your initial idea for approval.',
    },
    {
      id: 1,
      name: 'Round 1',
      description: 'Lacinia elit velit augue dignissim. Adipiscing non enim eget quam interdum neque.',
    },
    {
      id: 2,
      name: 'Round 2',
      description: 'Elit in ut tempus velit sed velit at nunc.',
    },
    {
      id: 3,
      name: 'Round 3',
      description: 'Elit in ut tempus velit sed velit at nunc.',
    },
  ].map(r => {
    const globalStatus = globalRoundStatus[r.id] || 'LOCKED';
    let teamStatus = getTeamRoundStatus(r.id);
    const isLive = globalStatus === 'LIVE';

    if (isLive && teamStatus === 'LOCKED') {
      teamStatus = 'NOT SUBMITTED';
    }

    return {
      ...r,
      status: teamStatus,
      canSubmit: isLive && teamStatus !== 'QUALIFIED' && teamStatus !== 'NOT_QUALIFIED',
      globalStatus
    };
  });

  const currentLiveRound = rounds.find(r => r.globalStatus === 'LIVE') || rounds[0];

  const getStatusBadge = (status: string) => {
    const baseClass = "px-4 py-1.5 text-[10px] font-bold tracking-widest border uppercase text-center min-w-[120px]";
    switch (status) {
      case 'LOCKED':
      case 'NOT SUBMITTED':
      case 'NOT_SUBMITTED':
        return <span className={`${baseClass} border-white/10 text-white/20 bg-white/5`}>NOT SUBMITTED</span>;
      case 'SUBMITTED':
      case 'UNDER_EVALUATION':
      case 'IN REVIEW':
        return <span className={`${baseClass} border-[#FEC84B] text-[#FEC84B]`}>IN REVIEW</span>;
      case 'NOT QUALIFIED':
      case 'NOT_QUALIFIED':
        return <span className={`${baseClass} border-[#DA1204] text-[#DA1204]`}>NOT QUALIFIED</span>;
      case 'PASSED':
      case 'QUALIFIED':
        return <span className={`${baseClass} border-[#32D583] text-[#32D583]`}>QUALIFIED</span>;
      default:
        return <span className={`${baseClass} border-white/10 text-white/20`}>{status}</span>;
    }
  };

  const handleSubmission = async (data: any) => {
    try {
      const response = await fetch('/api/submissions/submit', { // Assuming you created a submit proxy or use logic
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          round: data.roundId,
          submissionData: {
            title: data.title,
            description: data.description,
            links: [data.link1, data.link2, data.link3].filter(Boolean)
          }
        })
      });
      if (response.ok) {
        toast.success('Submission successful');
        window.location.reload();
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(`Submission failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (e) {
      console.error(e);
      toast.error('Error submitting');
    }
  };

  const handlePsSubmit = async () => {
    if (!psCodeInput) return;

    // Validate if PS code exists in our data
    const isValidPs = problemStatements.some(ps => ps.id === psCodeInput);
    if (!isValidPs) {
      toast.error("PS doesn't exists");
      return;
    }

    try {
      setIsSubmittingPs(true);
      const res = await fetch('/api/team/ps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ problemStatementId: psCodeInput })
      });

      if (res.ok) {
        toast.success("Problem Statement updated successfully!");
        window.location.reload();
      } else {
        const errorData = await res.json();
        toast.error(`Failed to update PS: ${errorData.error || 'Unknown error'}`);
      }
    } catch (e) {
      console.error("Error submitting PS", e);
      toast.error("Error submitting Problem Statement");
    } finally {
      setIsSubmittingPs(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied: ${text}`);
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

              {rounds.map((round, i) => {
                const isDone = round.globalStatus === 'COMPLETED';
                const isCurrent = round.globalStatus === 'LIVE';
                return (
                  <div key={i} className="relative flex flex-col items-center z-10">
                    <div className={`w-8 h-8 flex items-center justify-center border ${isDone ? 'bg-[#E3495A] border-[#E3495A]' : isCurrent ? 'bg-[#080808] border-[#E3495A]' : 'bg-[#080808] border-white/20'}`}>
                      {isDone && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {isCurrent && <div className="w-2 h-2 bg-[#E3495A]"></div>}
                    </div>
                    <div className="mt-4 text-center">
                      <p className={`text-[10px] font-bold tracking-widest ${isCurrent ? 'text-[#E3495A]' : 'text-white/40'}`}>{round.name}</p>
                    </div>
                  </div>
                );
              })}
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
              <div className="col-span-1 flex items-center gap-2">ROUND <span className="text-[8px]">NO</span></div>
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
                    <button
                      onClick={async () => {
                        setActiveRoundId(round.id);
                        if (round.status === 'SUBMITTED' || round.status === 'UNDER_EVALUATION') {
                          setIsFetchingSubmission(true);
                          try {
                            const res = await fetch('/api/submissions/view', {
                              headers: {
                                'Authorization': `Bearer ${token}`
                              }
                            });
                            if (res.ok) {
                              const { submission } = await res.json();
                              const roundKey = `round${round.id}Submission`;
                              const data = submission?.[roundKey];
                              setPopupInitialData(data || null);
                            } else {
                              console.error("Failed to fetch submission");
                              setPopupInitialData(null);
                              toast.error("Failed to load submission data");
                            }
                          } catch (e) {
                            console.error(e);
                            setPopupInitialData(null);
                            toast.error("Error loading submission");
                          } finally {
                            setIsFetchingSubmission(false);
                          }
                        } else {
                          setPopupInitialData(null);
                        }
                        setShowPopup(true);
                      }}
                      disabled={isFetchingSubmission}
                      className={`px-6 py-2.5 text-[11px] font-bold tracking-wider uppercase shadow-lg transition-colors
                        ${round.status === 'SUBMITTED' || round.status === 'UNDER_EVALUATION'
                          ? 'bg-transparent border border-[#FEC84B] text-[#FEC84B] hover:bg-[#FEC84B] hover:text-black'
                          : 'bg-[#E3495A] text-white shadow-[#E3495A]/10 hover:bg-[#E3495A]/90'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isFetchingSubmission ? 'LOADING...' : (round.status === 'SUBMITTED' || round.status === 'UNDER_EVALUATION' ? 'EDIT SUBMISSION' : 'ADD SUBMISSION')}
                    </button>
                  ) : (
                    <button className="px-10 py-2.5 border border-white/10 text-white text-[11px] font-bold tracking-wider uppercase hover:bg-white/5 cursor-not-allowed opacity-50">
                      {round.globalStatus === 'LOCKED' ? 'LOCKED' : 'VIEW'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 space-y-6 sticky top-24 h-fit">
          <div className="bg-[#080808] border border-white/5 p-6">
            <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-1">CURRENT STATUS</p>
            <h2 className="text-3xl font-bold tracking-tight">{currentLiveRound.name.toUpperCase()}</h2>
            <p className={`text-xs font-bold mt-1 uppercase tracking-widest ${currentLiveRound.status.includes('QUALIFIED') ? 'text-[#32D583]' : 'text-[#E3495A]'}`}>
              {currentLiveRound.status.replace('_', ' ')}
            </p>

            <div className="mt-8">
              <div className="h-2 bg-[#1A1A1A]">
                <div className="h-full bg-[#503FB8] w-[70%]"></div>
              </div>
              <p className="text-white/40 text-[10px] font-bold mt-2 text-right tracking-widest">LIVE</p>
            </div>
          </div>

          {/* Team Gradient Card */}
          <div className="p-[1px] relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #B647E5 0%, #F2AA3F 50%, #12AAFF 100%)' }}>
            <div className="bg-[#080808] p-5 relative z-10 h-full w-full">
              <div className="relative z-10">
                <p className="text-white/80 text-[10px] font-bold tracking-widest uppercase mb-1">TEAM NAME</p>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-white">{teamData.teamName}</h3>
                </div>

                {/* Team Code with Copy */}
                <div className="mt-4 pt-4 border-t border-dashed border-white/20">
                  <div
                    className="flex items-center justify-between group cursor-pointer"
                    onClick={() => copyToClipboard(teamData.teamId)}
                    title="Click to copy"
                  >
                    <div>
                      <p className="text-[9px] font-bold text-[#FB3103] tracking-widest uppercase mb-1">TEAM CODE</p>
                      <p className="text-sm font-mono font-bold text-white tracking-[0.2em]">{teamData.teamId}</p>
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center rounded bg-white/5 group-hover:bg-[#FB3103]/20 transition-all border border-white/10 group-hover:border-[#FB3103]/50">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60 group-hover:text-[#FB3103] transition-colors"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    </div>
                  </div>
                </div>
              </div>
              {/* Minimal SVG icons to match reference decoration */}
              <div className="absolute right-2 bottom-2 opacity-40">
                <svg width="60" height="60" viewBox="0 0 100 100" fill="white"><circle cx="80" cy="80" r="15" fill="none" stroke="white" strokeWidth="2" opacity="0.3" /><circle cx="60" cy="60" r="20" fill="none" stroke="white" strokeWidth="2" opacity="0.5" /></svg>
              </div>
            </div>
          </div>

          {/* Problem Statement Card */}
          <div className="bg-[#080808] border border-white/5 p-5">
            <h3 className="font-bold text-xs tracking-widest uppercase text-white/80 mb-4">PROBLEM STATEMENT</h3>

            {teamData.problemStatementId && teamData.problemStatementId.trim() !== "" ? (
              <div className="mb-4">
                <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-1">SELECTED PS</p>
                <div className="bg-white/5 p-3 border border-white/10 mb-2">
                  <p className="text-xs font-bold text-[#32D583] tracking-wider mb-1">{teamData.problemStatementId}</p>
                  <p className="text-[11px] text-white/80 leading-tight">
                    {problemStatements.find(ps => ps.id === teamData.problemStatementId)?.title || "Unknown Problem Statement"}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="space-y-3">
              {globalRoundStatus['0'] === 'COMPLETED' ? (
                <div className="bg-[#DA1204]/10 border border-[#DA1204]/20 p-3 rounded">
                  <p className="text-[#DA1204] text-[10px] font-bold tracking-widest uppercase">
                    PS SELECTION LOCKED (ROUND 0 COMPLETED)
                  </p>
                </div>
              ) : (
                <div>
                  <label className="text-[9px] font-bold text-white/40 tracking-widest uppercase mb-1 block">UPDATE PS CODE</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. HCSIT001"
                      className="flex-1 bg-[#121212] border border-white/10 text-white text-xs px-3 py-2 outline-none focus:border-[#E3495A] transition-colors"
                      value={psCodeInput}
                      onChange={(e) => setPsCodeInput(e.target.value.toUpperCase())}
                    />
                    <button
                      onClick={handlePsSubmit}
                      disabled={isSubmittingPs || !psCodeInput}
                      className="bg-[#E3495A] text-white text-[10px] font-bold px-3 py-2 border border-[#E3495A] hover:bg-[#E3495A]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingPs ? '...' : 'SUBMIT'}
                    </button>
                  </div>
                </div>
              )}
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

      <SubmitPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        roundId={activeRoundId}
        onSubmit={handleSubmission}
        initialData={popupInitialData}
      />
    </div>
  );
}