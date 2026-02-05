'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import type { Session } from '@supabase/supabase-js';
import type { GetProfileResponse, User as ProfileUser, Gender, CreateProfileResponse } from '@/types/profile';
import type { GetTeamResponse, TeamWithDetails } from '@/types/team';
import { CompleteProfile, CreateTeam, TeamDetail } from './components';
import { useDashboardContext } from '@/contexts/DashboardContext';
import { useToast } from '@/components/ui/Toast';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import Image from 'next/image';

export default function Dashboard() {
  const router = useRouter();
  const { setDashboardStep } = useDashboardContext();
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profileData, setProfileData] = useState<ProfileUser | null>(null);
  const [profileCompleted, setProfileCompleted] = useState<boolean | null>(null);
  const [teamData, setTeamData] = useState<TeamWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Confirmation Modal State
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    if (!session) {
      setDashboardStep(null);
      return;
    }

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
  }, [step, profileCompleted, profileData, teamData, setDashboardStep, session]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSession(session);
        setUser(session.user);

        // Clear hash if present (auth callback)
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
        setSession(null);
        setUser(null);
        setProfileData(null);
        setTeamData(null);
        setProfileCompleted(null);
        setLoading(false);
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
      // Optional: keep silent or toast
      // toast.error("Failed to load team data");
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
      toast.success('Profile created successfully!');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create profile';
      setError(msg);
      toast.error(msg);
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
      toast.success('Team created successfully!');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create team';
      setError(msg);
      toast.error(msg);
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
      toast.success('Joined team successfully!');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to join team';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveTeam = async () => {
    // This function will now be called by the modal's onConfirm
    // The initial click just opens the modal (handled in TeamDetails render below)

    if (!session) return;

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
      toast.success(profileData?.isTeamLeader ? 'Team disbanded successfully' : 'Left team successfully');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to leave team';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setAuthLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            hd: 'vitstudent.ac.in',
          },
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error logging in:', error);
      setError(error.message || 'Failed to sign in with Google');
      toast.error(error.message || 'Login failed');
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-[#0D0A0A] text-white flex items-center justify-center">
        <div className="text-xl font-jetbrains-mono text-[#E5310E]">Loading...</div>
      </div>
    );
  }

  // Unauthenticated State - Landing UI
  if (!session) {
    return (
      <div className="min-h-screen w-screen bg-[#0D0A0A] text-white overflow-hidden relative flex flex-col items-center justify-center">

        {/* Background Flame Image at Bottom */}
        <div className="absolute bottom-0 left-0 w-full z-0">
          <Image
            src="/dashboard/fire.svg"
            alt="Fire Background"
            width={1920}
            height={400}
            className="w-full h-auto object-cover opacity-80"
          />
        </div>

        <div className="z-10 flex flex-col items-center justify-center text-center px-4 -mt-20">
          {/* Logo */}
          <div className="mb-8 animate-fade-in">
            {/* Using standard img tag if Image component has issues with svg scaling or just wrapping in div */}
            <div className="w-32 h-32 md:w-40 md:h-40 relative">
              <Image
                src="/dashboard/y-red.svg"
                alt="Yantra Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold font-space-grotesk text-[#FB3103] mb-6 tracking-wide uppercase">
            JOIN THE HACK
          </h1>

          <p className="font-jetbrains-mono text-gray-300 max-w-lg mb-10 text-sm md:text-base leading-relaxed">
            Dive into the heart of innovation. Unleash your potential at Central Hack!
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-900/30 border border-red-500/50 rounded text-red-200 text-sm font-jetbrains-mono">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={authLoading}
            className="bg-[#3D0C11] hover:bg-[#5D1219] text-[#FB3103] border border-[#FB3103]/30 
                       font-headings font-bold py-3 px-8 rounded transition-all duration-300 transform hover:scale-105
                       shadow-[0_0_20px_rgba(251,49,3,0.15)] hover:shadow-[0_0_30px_rgba(251,49,3,0.25)]
                       disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            {authLoading ? 'CONNECTING...' : 'GET STARTED'}
          </button>
        </div>
      </div>
    );
  }

  // Authenticated State - Existing Dashboard
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
            onLeaveTeam={async () => setShowLeaveModal(true)}
            loading={loading}
            token={session.access_token}
          />
        )}
      </div>

      <ConfirmationModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onConfirm={handleLeaveTeam}
        title={profileData?.isTeamLeader ? "DISBAND TEAM?" : "LEAVE TEAM?"}
        message={profileData?.isTeamLeader
          ? "As the leader, leaving will disband the entire team. This action cannot be undone."
          : "Are you sure you want to leave this team? You will need to join or create a team again."}
        confirmText={profileData?.isTeamLeader ? "DISBAND" : "LEAVE"}
        isDangerous={true}
      />
    </div>
  );
}
