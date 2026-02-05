'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen w-screen bg-black flex justify-center items-center text-white">
      <p>Redirecting to Dashboard...</p>
    </div>
  );
}
