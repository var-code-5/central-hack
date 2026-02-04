'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import type { Session } from '@supabase/supabase-js';
import type { GetProfileResponse, User as ProfileUser, Gender, CreateProfileResponse } from '@/types/profile';
import type { GetTeamResponse, TeamWithDetails } from '@/types/team';
import { CompleteProfile, CreateTeam, TeamDetail } from './components';
import { useDashboardContext } from '@/contexts/DashboardContext';

export default function Dashboard() {
  const router = useRouter();
  const { setDashboardStep } = useDashboardContext();
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profileData, setProfileData] = useState<ProfileUser | null>(null);
  const [profileCompleted, setProfileCompleted] = useState<boolean | null>(null);
  const [teamData, setTeamData] = useState<TeamWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [step, setStep] = useState<'profile' | 'team'>('profile');
  const [isDayBoarder, setIsDayBoarder] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    regNo: '',
    gender: '' as Gender | '',
    hostelBlock: '',
    roomNo: '',
    mobileNo: '',
    school: '',
    branch: '',
  });

  const supabase = createClient();

  // Update dashboard step for navbar color
  useEffect(() => {
    if (step === 'profile' && profileCompleted === false) {
      setDashboardStep('profile');
    } else if (step === 'team' && profileData && !profileData.hasTeam) {
      setDashboardStep('team-create');
    } else if (step === 'team' && profileData?.hasTeam && teamData) {
      setDashboardStep('team-detail');
    }
    
    // Cleanup on unmount
    return () => {
      setDashboardStep(null);
    };
  }, [step, profileCompleted, profileData, teamData, setDashboardStep]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSession(session);
        setUser(session.user);

        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname);
        }

        await fetchProfile(session.access_token);
      } else {
        setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      } else if (session) {
        setSession(session);
        setUser(session.user);
        fetchProfile(session.access_token);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const fetchProfile = async (token: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data: GetProfileResponse = await response.json();
      
      if (data.profileCompleted) {
        setProfileCompleted(true);
        setProfileData(data.user);
       
        if (data.user.hasTeam) {
          await fetchTeam(token);
          setStep('team');
        } else {
          setStep('team');
        }
      } else {
        setProfileCompleted(false);
        setProfileData(null);
        setTeamData(null);
        setStep('profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeam = async (token: string) => {
    try {
      const response = await fetch('/api/team', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch team');
      }

      const data: GetTeamResponse = await response.json();
      setTeamData(data.team);
    } catch (err) {
      console.error('Failed to fetch team:', err);
      setTeamData(null);
    }
  };

  const handleCreateProfile = async () => {
    if (!session) return;

    const profilePayload = {
      name: formData.name,
      regNo: formData.regNo,
      gender: formData.gender as Gender,
      hostelBlock: isDayBoarder ? 'Day Boarder' : formData.hostelBlock,
      roomNo: isDayBoarder ? 'N/A' : formData.roomNo,
      mobileNo: formData.mobileNo,
      school: formData.school,
      branch: formData.branch,
    };

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/profile/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profilePayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create profile');
      }

      const data: CreateProfileResponse = await response.json();
      setProfileCompleted(true);
      setProfileData(data.user);
      setStep('team');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!session || !teamName.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/team/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamName: teamName.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create team');
      }

      await fetchProfile(session.access_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async () => {
    if (!session || !teamCode.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/team/join', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId: teamCode.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to join team');
      }

      await fetchProfile(session.access_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join team');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveTeam = async () => {
    if (!session) return;
    
    if (!confirm(profileData?.isTeamLeader ? 'As the leader, leaving will disband the entire team. Are you sure?' : 'Are you sure you want to leave this team?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/team/leave', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to leave team');
      }

      await fetchProfile(session.access_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to leave team');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-[#0D0A0A] text-white flex items-center justify-center">
        <div className="text-xl font-jetbrains-mono text-[#E5310E]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-[#0D0A0A] text-white overflow-hidden">
      {/* Main Content */}
      <div className="pt-28 px-4 md:px-8 lg:px-16 min-h-screen flex flex-col md:flex-row items-center">
        {error && (
          <div className="fixed top-28 left-1/2 -translate-x-1/2 bg-red-900/90 border border-red-500 rounded px-6 py-3 font-jetbrains-mono text-sm z-50">
            {error}
          </div>
        )}

        {/* Profile Form Step */}
        {step === 'profile' && profileCompleted === false && (
          <CompleteProfile
            user={user}
            formData={formData}
            setFormData={setFormData}
            isDayBoarder={isDayBoarder}
            setIsDayBoarder={setIsDayBoarder}
            loading={loading}
            onSubmit={handleCreateProfile}
            onGoBack={() => router.push('/')}
          />
        )}

        {/* Team Step - No Team */}
        {step === 'team' && profileCompleted && profileData && !profileData.hasTeam && (
          <CreateTeam
            teamName={teamName}
            setTeamName={setTeamName}
            teamCode={teamCode}
            setTeamCode={setTeamCode}
            loading={loading}
            onCreateTeam={handleCreateTeam}
            onJoinTeam={handleJoinTeam}
            onGoBack={() => setStep('profile')}
          />
        )}

        {/* Team Step - Has Team - Full Dashboard View */}
        {step === 'team' && profileCompleted && profileData && profileData.hasTeam && teamData && (
          <TeamDetail 
            profileData={profileData}
            teamData={teamData}
            user={user}
            onLeaveTeam={handleLeaveTeam}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
