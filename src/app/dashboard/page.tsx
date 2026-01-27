'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import type { Session } from '@supabase/supabase-js';
import type { GetProfileResponse, User as ProfileUser, Gender, CreateProfileResponse } from '@/types/profile';
import type { GetTeamResponse } from '@/types/team';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profileData, setProfileData] = useState<ProfileUser | null>(null);
  const [profileCompleted, setProfileCompleted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSession(session);
        setUser(session.user);

        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname);
        }

        // Fetch profile data
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
      } else {
        setProfileCompleted(false);
        setProfileData(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/auth/logout', { method: 'POST' });
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleCreateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session) return;

    const formData = new FormData(e.currentTarget);
    const profilePayload = {
      name: formData.get('name') as string,
      regNo: formData.get('regNo') as string,
      gender: formData.get('gender') as Gender,
      hostelBlock: formData.get('hostelBlock') as string,
      roomNo: formData.get('roomNo') as string,
      mobileNo: formData.get('mobileNo') as string,
    };

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profilePayload),
      });

      if (!response.ok) {
        throw new Error('Failed to create profile');
      }

      const data: CreateProfileResponse = await response.json();
      setProfileCompleted(true);
      setProfileData(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile');
    } finally {
      setLoading(false);
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-space-grotesk font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-jetbrains-mono transition-colors"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500 rounded-xl p-4 mb-6 font-jetbrains-mono">
            {error}
          </div>
        )}

        {profileCompleted === false && (
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-space-grotesk font-semibold mb-6">Complete Your Profile</h2>
            <p className="text-gray-400 mb-6 font-jetbrains-mono">Please fill in your details to continue</p>
            
            <form onSubmit={handleCreateProfile} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-jetbrains-mono text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 font-jetbrains-mono"
                />
              </div>

              <div>
                <label htmlFor="regNo" className="block text-sm font-jetbrains-mono text-gray-300 mb-2">
                  Registration Number *
                </label>
                <input
                  type="text"
                  id="regNo"
                  name="regNo"
                  required
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 font-jetbrains-mono"
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-jetbrains-mono text-gray-300 mb-2">
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 font-jetbrains-mono"
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="hostelBlock" className="block text-sm font-jetbrains-mono text-gray-300 mb-2">
                    Hostel Block *
                  </label>
                  <input
                    type="text"
                    id="hostelBlock"
                    name="hostelBlock"
                    required
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 font-jetbrains-mono"
                  />
                </div>

                <div>
                  <label htmlFor="roomNo" className="block text-sm font-jetbrains-mono text-gray-300 mb-2">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    id="roomNo"
                    name="roomNo"
                    required
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 font-jetbrains-mono"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="mobileNo" className="block text-sm font-jetbrains-mono text-gray-300 mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  id="mobileNo"
                  name="mobileNo"
                  required
                  pattern="[0-9]{10}"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 font-jetbrains-mono"
                  placeholder="10 digit mobile number"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-jetbrains-mono transition-colors"
              >
                {loading ? 'Creating Profile...' : 'Create Profile'}
              </button>
            </form>
          </div>
        )}

        {profileCompleted === true && profileData && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-space-grotesk font-semibold mb-4">Profile Information</h2>
              <div className="grid grid-cols-2 gap-4 font-jetbrains-mono text-sm">
                <div>
                  <p className="text-gray-400">Name</p>
                  <p className="font-semibold">{profileData.name}</p>
                </div>
                <div>
                  <p className="text-gray-400">Registration Number</p>
                  <p className="font-semibold">{profileData.regNo}</p>
                </div>
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="font-semibold">{profileData.email}</p>
                </div>
                <div>
                  <p className="text-gray-400">Gender</p>
                  <p className="font-semibold">{profileData.gender}</p>
                </div>
                <div>
                  <p className="text-gray-400">Hostel</p>
                  <p className="font-semibold">{profileData.hostelBlock} - {profileData.roomNo}</p>
                </div>
                <div>
                  <p className="text-gray-400">Mobile</p>
                  <p className="font-semibold">{profileData.mobileNo}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-space-grotesk font-semibold mb-4">Team Management</h2>
              
              {profileData.hasTeam ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 font-jetbrains-mono">
                    <span className="px-3 py-1 bg-green-900/30 border border-green-500 rounded-lg text-green-400">
                      {profileData.isTeamLeader ? 'Team Leader' : 'Team Member'}
                    </span>
                  </div>
                  <p className="text-gray-400 font-jetbrains-mono text-sm">
                    You are {profileData.isTeamLeader ? 'leading' : 'part of'} a team
                  </p>
                  {/* Add team details component here */}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-400 font-jetbrains-mono text-sm mb-4">
                    You are not part of any team yet. Create a new team or join an existing one.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-jetbrains-mono transition-colors">
                      Create Team
                    </button>
                    <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-jetbrains-mono transition-colors">
                      Join Team
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
