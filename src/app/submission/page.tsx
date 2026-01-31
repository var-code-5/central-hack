'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import type { Session } from '@supabase/supabase-js';

type RoundStatus = 'locked' | 'active' | 'submitted' | 'evaluated';

interface Round {
  id: string;
  number: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: RoundStatus;
  submissionLinks?: string[];
  feedback?: string;
  score?: number;
}

const roundsData: Round[] = [
  {
    id: 'round-0',
    number: 0,
    title: 'Registration & Team Formation',
    description: 'Complete team registration and submit initial project idea overview.',
    startDate: '2026-01-31T10:00:00',
    endDate: '2026-02-01T10:00:00',
    status: 'evaluated',
  },
  {
    id: 'round-1',
    number: 1,
    title: 'Ideation Round',
    description: 'Submit your initial idea and problem approach. Include problem statement understanding, proposed solution, and tech stack.',
    startDate: '2026-02-01T10:00:00',
    endDate: '2026-02-02T18:00:00',
    status: 'locked',
  },
  {
    id: 'round-2',
    number: 2,
    title: 'Prototype Submission',
    description: 'Submit a working prototype or MVP of your solution. Include GitHub repository link and demo video.',
    startDate: '2026-02-02T20:00:00',
    endDate: '2026-02-03T10:00:00',
    status: 'locked',
  },
  {
    id: 'round-3',
    number: 3,
    title: 'Final Presentation',
    description: 'Present your final solution to the judges. Include a pitch deck and live demo.',
    startDate: '2026-02-03T14:00:00',
    endDate: '2026-02-03T18:00:00',
    status: 'locked',
  },
];

export default function SubmissionPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [rounds, setRounds] = useState<Round[]>(roundsData);
  const [selectedRound, setSelectedRound] = useState<Round | null>(null);
  const [submissionLinks, setSubmissionLinks] = useState<string[]>(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setSession(session);
      // Fetch existing submissions
      await fetchSubmissions(session.access_token);
      setLoading(false);
    };

    getSession();
  }, [router, supabase]);

  const fetchSubmissions = async (token: string) => {
    try {
      const response = await fetch('/api/submissions/view', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const data = await response.json();
        const submission = data.submission;
        
        if (submission) {
          setRounds(prev => prev.map(round => {
            const roundKey = `round${round.number}Submission` as keyof typeof submission;
            const links = submission[roundKey] as string[] | undefined;
            
            if (links && links.length > 0) {
              return { ...round, status: 'submitted' as RoundStatus, submissionLinks: links };
            }
            return round;
          }));
        }
      }
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
    }
  };

  const addLinkField = () => {
    setSubmissionLinks(prev => [...prev, '']);
  };

  const removeLinkField = (index: number) => {
    setSubmissionLinks(prev => prev.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, value: string) => {
    setSubmissionLinks(prev => prev.map((link, i) => i === index ? value : link));
  };

  const startEditing = (round: Round) => {
    setSelectedRound(round);
    setSubmissionLinks(round.submissionLinks && round.submissionLinks.length > 0 
      ? [...round.submissionLinks] 
      : ['']);
    setIsEditing(true);
    setError(null);
  };

  const cancelEditing = () => {
    setSelectedRound(null);
    setSubmissionLinks(['']);
    setIsEditing(false);
    setError(null);
  };

  const getStatusColor = (status: RoundStatus) => {
    switch (status) {
      case 'locked':
        return 'bg-gray-600';
      case 'active':
        return 'bg-blue-600';
      case 'submitted':
        return 'bg-yellow-600';
      case 'evaluated':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusText = (status: RoundStatus) => {
    switch (status) {
      case 'locked':
        return 'Locked';
      case 'active':
        return 'Active';
      case 'submitted':
        return 'Submitted';
      case 'evaluated':
        return 'Evaluated';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSubmit = async (roundNumber: number) => {
    const validLinks = submissionLinks.filter(link => link.trim() !== '');
    
    if (validLinks.length === 0) {
      setError('Please enter at least one submission link');
      return;
    }

    if (!session) {
      setError('You must be logged in to submit');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/submissions/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          round: roundNumber,
          links: validLinks,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to submit');
      }
      
      // Update round status locally
      setRounds(prev => prev.map(round => 
        round.number === roundNumber 
          ? { ...round, status: 'submitted' as RoundStatus, submissionLinks: validLinks }
          : round
      ));
      
      setSubmissionLinks(['']);
      setSelectedRound(null);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to submit');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-[#000307] text-white flex items-center justify-center">
        <div className="text-xl font-jetbrains-mono">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-[#000307] text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-space-grotesk font-bold">Submissions</h1>
            <p className="text-gray-400 font-jetbrains-mono text-sm mt-1">
              Submit your work for each round
            </p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-jetbrains-mono text-sm transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-700" />

          {/* Rounds */}
          <div className="space-y-6">
            {rounds.map((round, index) => (
              <div key={round.id} className="relative pl-16">
                {/* Timeline dot */}
                <div 
                  className={`absolute left-4 w-5 h-5 rounded-full border-4 border-[#000307] ${getStatusColor(round.status)}`}
                />

                {/* Round card */}
                <div className={`rounded-xl p-6 border ${
                  round.status === 'active' 
                    ? 'bg-blue-900/20 border-blue-500' 
                    : 'bg-gray-800/50 border-gray-700'
                }`}>
                  {/* Round header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-jetbrains-mono text-gray-500">
                          ROUND {round.number}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(round.status)}`}>
                          {getStatusText(round.status)}
                        </span>
                        {round.status === 'active' && (
                          <span className="text-xs px-2 py-0.5 rounded bg-blue-500 animate-pulse">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl font-space-grotesk font-semibold">{round.title}</h2>
                    </div>
                    {round.score !== undefined && (
                      <div className="text-right">
                        <p className="text-xs text-gray-400 font-jetbrains-mono">Score</p>
                        <p className="text-2xl font-bold text-green-400">{round.score}/100</p>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 font-jetbrains-mono text-sm mb-4">
                    {round.description}
                  </p>

                  {/* Timeline */}
                  <div className="flex items-center gap-4 text-xs font-jetbrains-mono text-gray-500 mb-4">
                    <span>Start: {formatDate(round.startDate)}</span>
                    <span>•</span>
                    <span>End: {formatDate(round.endDate)}</span>
                  </div>

                  {/* Submission links if submitted */}
                  {round.submissionLinks && round.submissionLinks.length > 0 && (
                    <div className="mb-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
                      <p className="text-xs text-gray-400 font-jetbrains-mono mb-2">Your Submissions</p>
                      <div className="space-y-1">
                        {round.submissionLinks.map((link, idx) => (
                          <a 
                            key={idx}
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block text-blue-400 hover:text-blue-300 font-jetbrains-mono text-sm break-all"
                          >
                            {idx + 1}. {link}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Feedback if evaluated */}
                  {round.feedback && (
                    <div className="mb-4 p-3 bg-green-900/20 rounded-lg border border-green-700/50">
                      <p className="text-xs text-green-400 font-jetbrains-mono mb-1">Feedback</p>
                      <p className="text-gray-300 font-jetbrains-mono text-sm">{round.feedback}</p>
                    </div>
                  )}

                  {/* Actions */}
                  {(round.status === 'active' || round.status === 'submitted') && (
                    <div>
                      {selectedRound?.id === round.id ? (
                        <div className="space-y-3">
                          {/* Error message */}
                          {error && (
                            <div className="p-3 bg-red-900/30 border border-red-500 rounded-lg text-red-400 font-jetbrains-mono text-sm">
                              {error}
                            </div>
                          )}
                          
                          <div>
                            <label className="block text-sm font-jetbrains-mono text-gray-300 mb-2">
                              Submission Links *
                            </label>
                            <div className="space-y-2">
                              {submissionLinks.map((link, idx) => (
                                <div key={idx} className="flex gap-2">
                                  <input
                                    type="url"
                                    value={link}
                                    onChange={(e) => updateLink(idx, e.target.value)}
                                    placeholder="https://github.com/your-repo or https://drive.google.com/..."
                                    className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 font-jetbrains-mono text-sm"
                                  />
                                  {submissionLinks.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeLinkField(idx)}
                                      className="px-3 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg font-jetbrains-mono text-sm transition-colors"
                                    >
                                      ✕
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={addLinkField}
                              className="mt-2 px-3 py-1 text-blue-400 hover:text-blue-300 font-jetbrains-mono text-sm transition-colors"
                            >
                              + Add another link
                            </button>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={cancelEditing}
                              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-jetbrains-mono text-sm transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSubmit(round.number)}
                              disabled={isSubmitting}
                              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-jetbrains-mono text-sm transition-colors"
                            >
                              {isSubmitting ? (isEditing ? 'Updating...' : 'Submitting...') : (isEditing ? 'Update Submission' : 'Submit')}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {round.status === 'active' && !round.submissionLinks?.length && (
                            <button
                              onClick={() => setSelectedRound(round)}
                              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-jetbrains-mono text-sm transition-colors"
                            >
                              Make Submission
                            </button>
                          )}
                          {round.submissionLinks && round.submissionLinks.length > 0 && (
                            <button
                              onClick={() => startEditing(round)}
                              className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-jetbrains-mono text-sm transition-colors"
                            >
                              ✏️ Edit Submission
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {round.status === 'locked' && (
                    <div className="text-center py-2 text-gray-500 font-jetbrains-mono text-sm">
                      🔒 This round is not yet open
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
