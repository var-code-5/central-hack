'use client';

import React, { useState } from 'react';
import type { TeamWithDetails } from '@/types/team';

// Sample Problem Statements
const problemStatements = [
  { id: 'HCSIT001', title: 'Smart Campus Navigation System' },
  { id: 'HCSIT002', title: 'AI-Powered Study Planner' },
  { id: 'HCSIT003', title: 'Blockchain-Based Certificate Verification' },
  { id: 'HCHEM001', title: 'Green Chemistry for Water Purification' },
  { id: 'HCHEM002', title: 'Bio-degradable Packaging Solutions' },
  { id: 'HMECH001', title: 'Autonomous Drone Delivery System' },
  { id: 'HMECH002', title: 'Smart Waste Management Robot' },
  { id: 'HEEE001', title: 'IoT-Based Energy Management' },
  { id: 'HEEE002', title: 'Smart Grid Optimization' },
  { id: 'HECE001', title: 'Wearable Health Monitor' },
  { id: 'HECE002', title: 'Smart Traffic Management System' },
];

interface TeamCardProps {
  team: TeamWithDetails;
  currentUserEmail: string;
  isLeader: boolean;
  onLeaveTeam: () => Promise<void>;
  onSubmitProblemStatement: (psId: string) => Promise<void>;
}

export default function TeamCard({
  team,
  currentUserEmail,
  isLeader,
  onLeaveTeam,
  onSubmitProblemStatement,
}: TeamCardProps) {
  const [copied, setCopied] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [selectedPS, setSelectedPS] = useState(team.problemStatementId || '');
  const [isSubmittingPS, setIsSubmittingPS] = useState(false);

  const copyTeamCode = async () => {
    try {
      await navigator.clipboard.writeText(team.teamId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleLeaveTeam = async () => {
    if (!confirm(isLeader ? 'As the leader, leaving will disband the entire team. Are you sure?' : 'Are you sure you want to leave this team?')) {
      return;
    }
    try {
      setIsLeaving(true);
      await onLeaveTeam();
    } catch (err) {
      console.error('Failed to leave team:', err);
    } finally {
      setIsLeaving(false);
    }
  };

  const handleSubmitPS = async () => {
    if (!selectedPS) return;
    try {
      setIsSubmittingPS(true);
      await onSubmitProblemStatement(selectedPS);
    } catch (err) {
      console.error('Failed to submit PS:', err);
    } finally {
      setIsSubmittingPS(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Info */}
      <div className="grid grid-cols-2 gap-4 font-jetbrains-mono text-sm">
        <div>
          <p className="text-gray-400">Team Name</p>
          <p className="font-semibold">{team.teamName}</p>
        </div>
        <div>
          <p className="text-gray-400">Team Code</p>
          <div className="flex items-center gap-2">
            <p className="font-semibold">{team.teamId}</p>
            <button
              onClick={copyTeamCode}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
        <div>
          <p className="text-gray-400">Your Role</p>
          <p className="font-semibold">{isLeader ? 'Team Leader' : 'Team Member'}</p>
        </div>
        <div>
          <p className="text-gray-400">Problem Statement</p>
          <p className="font-semibold">{team.problemStatementId || 'Not Selected'}</p>
        </div>
      </div>

      {/* Team Members */}
      <div>
        <p className="text-gray-400 font-jetbrains-mono text-sm mb-2">Team Members ({team.teamMembers.length}/4)</p>
        <div className="space-y-2">
          {team.teamMembers.map((member) => (
            <div
              key={member.email}
              className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-700"
            >
              <div>
                <p className="font-jetbrains-mono text-sm font-semibold">
                  {member.name}
                  {member.email === currentUserEmail && <span className="text-gray-500 ml-2">(you)</span>}
                </p>
                <p className="text-xs text-gray-500 font-jetbrains-mono">{member.regNo}</p>
              </div>
              {member.email === team.teamLeader && (
                <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded">Leader</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Problem Statement Selection */}
      <div>
        <p className="text-gray-400 font-jetbrains-mono text-sm mb-2">Problem Statement</p>
        <div className="flex gap-3">
          <select
            value={selectedPS}
            onChange={(e) => setSelectedPS(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 font-jetbrains-mono text-sm"
          >
            <option value="">Select Problem Statement</option>
            {problemStatements.map((ps) => (
              <option key={ps.id} value={ps.id}>
                {ps.id} - {ps.title}
              </option>
            ))}
          </select>
          <button
            onClick={handleSubmitPS}
            disabled={!selectedPS || selectedPS === team.problemStatementId || isSubmittingPS}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-jetbrains-mono text-sm transition-colors"
          >
            {isSubmittingPS ? 'Saving...' : 'Save'}
          </button>
        </div>
        {team.problemStatementId && (
          <p className="text-xs text-green-400 mt-1 font-jetbrains-mono">
            Current: {team.problemStatementId}
          </p>
        )}
      </div>

      {/* Leave Team */}
      <div>
        <button
          onClick={handleLeaveTeam}
          disabled={isLeaving}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded-lg font-jetbrains-mono text-sm transition-colors"
        >
          {isLeaving ? 'Leaving...' : 'Leave Team'}
        </button>
      </div>
    </div>
  );
}
