'use client';

import React, { useEffect, useMemo } from 'react';
import Image from 'next/image';
import { branches, schools, mhBlocks, lhBlocks } from '../constants';
import type { Gender } from '@/types/profile';
import { useToast } from '@/components/ui/Toast';

interface FormData {
  name: string;
  regNo: string;
  gender: Gender | '';
  hostelBlock: string;
  roomNo: string;
  mobileNo: string;
  school: string;
  branch: string;
}

interface CompleteProfileProps {
  user: any;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  isDayBoarder: boolean;
  setIsDayBoarder: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  onSubmit: () => Promise<void>;
  onGoBack: () => void;
}

// Helper function to parse Google display name
function parseDisplayName(displayName: string): { name: string; regNo: string } {
  if (!displayName) return { name: '', regNo: '' };
  
  const firstDigitIndex = displayName.search(/\d/);
  
  if (firstDigitIndex === -1) {
    return { name: displayName.trim(), regNo: '' };
  }
  
  const name = displayName.substring(0, firstDigitIndex).trim();
  const regNo = displayName.substring(firstDigitIndex).trim().toUpperCase();
  
  return { name, regNo };
}

export default function CompleteProfile({
  user,
  formData,
  setFormData,
  isDayBoarder,
  setIsDayBoarder,
  loading,
  onSubmit,
  onGoBack,
}: CompleteProfileProps) {
  const toast = useToast();
  
  // Parse display name and auto-fill on mount
  useEffect(() => {
    if (user?.user_metadata?.full_name || user?.user_metadata?.name) {
      const displayName = user.user_metadata.full_name || user.user_metadata.name || '';
      const { name, regNo } = parseDisplayName(displayName);
      
      if (!formData.name && !formData.regNo) {
        setFormData(prev => ({
          ...prev,
          name: name,
          regNo: regNo,
        }));
      }
    }
  }, [user, setFormData, formData.name, formData.regNo]);

  // Handle day boarder change
  useEffect(() => {
    if (isDayBoarder) {
      setFormData(prev => ({
        ...prev,
        hostelBlock: 'DS',
        roomNo: 'N/A',
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        hostelBlock: prev.hostelBlock === 'DS' ? '' : prev.hostelBlock,
        roomNo: prev.roomNo === 'N/A' ? '' : prev.roomNo,
      }));
    }
  }, [isDayBoarder, setFormData]);

  // Clear hostel block when gender changes
  useEffect(() => {
    if (formData.gender && !isDayBoarder) {
      const validBlocks = formData.gender === 'MALE' ? mhBlocks : 
                          formData.gender === 'FEMALE' ? lhBlocks : [];
      if (formData.hostelBlock && !validBlocks.includes(formData.hostelBlock) && formData.hostelBlock !== 'DS') {
        setFormData(prev => ({ ...prev, hostelBlock: '' }));
      }
    }
  }, [formData.gender, formData.hostelBlock, isDayBoarder, setFormData]);

  // Get hostel block options based on gender
  const hostelBlockOptions = useMemo(() => {
    if (isDayBoarder) return [];
    if (formData.gender === 'MALE') return mhBlocks;
    if (formData.gender === 'FEMALE') return lhBlocks;
    return []; 
  }, [formData.gender, isDayBoarder]);

  const getMissingFieldMessage = (): string | null => {
    if (!formData.name.trim()) return 'Please enter your name.';
    if (!formData.regNo.trim()) return 'Please enter your registration number.';
    if (!formData.gender) return 'Please select your gender.';
    if (!formData.school) return 'Please select your school.';
    if (!formData.branch) return 'Please select your branch.';
    if (!formData.mobileNo.trim()) return 'Please enter your mobile number.';
    if (!isDayBoarder) {
      if (!formData.hostelBlock) return 'Please select your hostel block.';
      if (!formData.roomNo.trim()) return 'Please enter your room number.';
    }
    return null;
  };

  const handleSubmit = async () => {
    const missingFieldMessage = getMissingFieldMessage();
    if (missingFieldMessage) {
      toast.error(missingFieldMessage);
      return;
    }

    await onSubmit();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-[#0D0A0A] overflow-x-hidden pb-4">
      
      {/* ---------------------------------------------------------------------------
          Left Side - Card Preview 
          Adjusted: Flex column on mobile, sticky/fixed height feel not strictly enforced to allow scrolling on small screens
      --------------------------------------------------------------------------- */}
      <div className='hidden lg:block lg:w-1/2'></div>
      <div className="hidden w-full lg:w-1/2 md:flex items-center justify-center p-4 md:p-8 lg:p-12 md:fixed lg:top-0 lg:h-screen">
        <div className="relative border-4 border-[#E5310E]/30 rounded-lg w-full max-w-[450px] shadow-2xl shadow-[#E5310E]/10 transition-transform duration-300 hover:scale-[1.02]">
          
          <div className="bg-[#E5310E] p-6 md:p-8 aspect-[3/4] md:aspect-[4/5] flex flex-col justify-between rounded-md relative overflow-hidden">
            
            {/* Background Texture/Pattern overlay (Optional visual enhancement) */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/noise.png')] pointer-events-none"></div>

            {/* User Card Image */}
            <div className="flex items-center justify-center flex-1 z-10 my-4">
              <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[200px] flex items-center justify-center">
                <Image 
                  src="/dashboard/user-card-img.svg" 
                  alt="User" 
                  width={350} 
                  height={200}
                  className="w-full h-auto object-contain opacity-90 drop-shadow-xl"
                  priority
                />
              </div>
            </div>
            
            {/* User Info - Consistent Typography */}
            <div className="mt-auto z-10 space-y-5 text-white font-jetbrains-mono border-t border-white/20 pt-6">
              
              {/* Name Section */}
              <div>
                <p className="text-[10px] md:text-xs opacity-75 uppercase tracking-wider mb-1">NAME</p>
                <p className="text-lg md:text-xl font-bold truncate">
                  {formData.name || 'YOUR NAME'}
                </p>
              </div>

              {/* Grid for Email, Hostel, RegNo to ensure consistent alignment and sizing */}
              <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                
                <div className="col-span-2">
                  <p className="text-[10px] md:text-xs opacity-75 uppercase tracking-wider mb-1">EMAIL</p>
                  <p className="text-sm md:text-base font-bold truncate opacity-90">
                    {user?.email || 'email@example.com'}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] md:text-xs opacity-75 uppercase tracking-wider mb-1">HOSTEL BLOCK</p>
                  <p className="text-sm md:text-base font-bold truncate opacity-90">
                    {isDayBoarder ? 'DAY SCHOLAR' : formData.hostelBlock || '--'}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] md:text-xs opacity-75 uppercase tracking-wider mb-1">REGISTRATION NO</p>
                  <p className="text-sm md:text-base font-bold uppercase truncate opacity-90">
                    {formData.regNo || '--'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------------
          Right Side - Form 
          Adjusted: Padding and font sizes for mobile
      --------------------------------------------------------------------------- */}
      <div className="w-full lg:w-1/2 p-4 md:p-8 lg:p-12 flex flex-col justify-center min-h-screen mb-8">
        <div className="max-w-lg mx-auto w-full">
          <p className="text-[#E5310E] font-jetbrains-mono text-xs md:text-sm mb-2 tracking-widest">// YOUR-INFO</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-space-grotesk font-bold text-[#E5310E] mb-6 md:mb-8 leading-tight">
            ENTER YOUR DETAILS
          </h1>

          <div className="space-y-4 md:space-y-5">
            {/* Email - Read Only */}
            <div>
              <label className="block text-[#E5310E] font-jetbrains-mono text-xs md:text-sm mb-2 uppercase">
                EMAIL
              </label>
              <input
                type="text"
                value={user?.email || ''}
                readOnly
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3D2A2A] text-gray-400 font-jetbrains-mono text-sm md:text-base focus:outline-none cursor-not-allowed rounded-sm"
              />
            </div>

            {/* Name - Auto-filled and Locked */}
            <div>
              <label className="block text-[#E5310E] font-jetbrains-mono text-xs md:text-sm mb-2 uppercase">
                NAME
              </label>
              <input
                type="text"
                value={formData.name}
                readOnly
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3D2A2A] text-gray-400 font-jetbrains-mono text-sm md:text-base focus:outline-none cursor-not-allowed rounded-sm"
              />
            </div>

            {/* Registration Number - Auto-filled and Locked */}
            <div>
              <label className="block text-[#E5310E] font-jetbrains-mono text-xs md:text-sm mb-2 uppercase">
                REGISTRATION NUMBER
              </label>
              <input
                type="text"
                value={formData.regNo}
                readOnly
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3D2A2A] text-gray-400 font-jetbrains-mono text-sm md:text-base uppercase focus:outline-none cursor-not-allowed rounded-sm"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-[#E5310E] font-jetbrains-mono text-xs md:text-sm mb-2 uppercase">
                GENDER*
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                className="w-full px-4 py-3 bg-[#0D0A0A] border border-[#3D2A2A] text-white font-jetbrains-mono text-sm md:text-base focus:outline-none focus:border-[#E5310E] rounded-sm appearance-none"
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            {/* Day Scholar Checkbox */}
            <div className="flex items-center justify-between py-2 p-1 border border-transparent hover:border-[#3D2A2A] rounded-sm transition-colors">
              <label className="text-[#E5310E] font-jetbrains-mono text-xs md:text-sm uppercase cursor-pointer" htmlFor="dayScholar">
                ARE YOU A DAY SCHOLAR?
              </label>
              <input
                id="dayScholar"
                type="checkbox"
                checked={isDayBoarder}
                onChange={(e) => setIsDayBoarder(e.target.checked)}
                className="w-5 h-5 accent-[#E5310E] bg-transparent border border-[#3D2A2A] cursor-pointer"
              />
            </div>

            {/* Hostel Block and Room No */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#E5310E] font-jetbrains-mono text-xs md:text-sm mb-2 uppercase">
                  HOSTEL BLOCK
                </label>
                {isDayBoarder ? (
                  <input
                    type="text"
                    value="DS"
                    readOnly
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3D2A2A] text-gray-400 font-jetbrains-mono text-sm md:text-base focus:outline-none cursor-not-allowed rounded-sm"
                  />
                ) : (
                  <select
                    value={formData.hostelBlock}
                    onChange={(e) => setFormData({ ...formData, hostelBlock: e.target.value })}
                    disabled={!formData.gender || formData.gender === 'OTHER'}
                    className="w-full px-4 py-3 bg-[#0D0A0A] border border-[#3D2A2A] text-white font-jetbrains-mono text-sm md:text-base focus:outline-none focus:border-[#E5310E] disabled:opacity-50 disabled:cursor-not-allowed rounded-sm appearance-none"
                  >
                    <option value="">Block</option>
                    {hostelBlockOptions.map((block) => (
                      <option key={block} value={block}>{block}</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-[#E5310E] font-jetbrains-mono text-xs md:text-sm mb-2 uppercase">
                  ROOM NO
                </label>
                {isDayBoarder ? (
                  <input
                    type="text"
                    value="N/A"
                    readOnly
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3D2A2A] text-gray-400 font-jetbrains-mono text-sm md:text-base focus:outline-none cursor-not-allowed rounded-sm"
                  />
                ) : (
                  <input
                    type="text"
                    value={formData.roomNo}
                    onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                    placeholder="Room No"
                    className="w-full px-4 py-3 bg-transparent border border-[#3D2A2A] text-white font-jetbrains-mono text-sm md:text-base focus:outline-none focus:border-[#E5310E] placeholder:text-gray-600 rounded-sm"
                  />
                )}
              </div>
            </div>

            {/* School */}
            <div>
              <label className="block text-[#E5310E] font-jetbrains-mono text-xs md:text-sm mb-2 uppercase">
                SCHOOL*
              </label>
              <select
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                className="w-full px-4 py-3 bg-[#0D0A0A] border border-[#3D2A2A] text-white font-jetbrains-mono text-sm md:text-base focus:outline-none focus:border-[#E5310E] rounded-sm appearance-none"
              >
                <option value="">Select School</option>
                {schools.map((school) => (
                  <option key={school} value={school}>{school}</option>
                ))}
              </select>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-[#E5310E] font-jetbrains-mono text-xs md:text-sm mb-2 uppercase">
                BRANCH*
              </label>
              <select
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-4 py-3 bg-[#0D0A0A] border border-[#3D2A2A] text-white font-jetbrains-mono text-sm md:text-base focus:outline-none focus:border-[#E5310E] rounded-sm appearance-none"
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-[#E5310E] font-jetbrains-mono text-xs md:text-sm mb-2 uppercase">
                MOBILE NUMBER*
              </label>
              <input
                type="tel"
                value={formData.mobileNo}
                onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                placeholder="10 digit mobile number"
                pattern="[0-9]{10}"
                className="w-full px-4 py-3 bg-transparent border border-[#3D2A2A] text-white font-jetbrains-mono text-sm md:text-base focus:outline-none focus:border-[#E5310E] placeholder:text-gray-600 rounded-sm"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                onClick={onGoBack}
                className="px-6 md:px-8 py-3 bg-transparent border border-[#3D2A2A] text-white font-jetbrains-mono text-sm md:text-base uppercase hover:border-[#E5310E] transition-colors rounded-sm"
              >
                Go Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-8 py-3 bg-[#E5310E]/90 cursor-pointer text-white font-jetbrains-mono text-sm md:text-base uppercase hover:bg-[#E5310E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
              >
                {loading ? 'Creating...' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}