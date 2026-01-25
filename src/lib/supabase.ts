import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Custom cookie storage for Supabase
const cookieStorage = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null;
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieKey, cookieValue] = cookie.split('=').map(c => c.trim());
      if (cookieKey === key) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  },
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return;
    // Set cookie with 7 days expiry
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    document.cookie = `${key}=${encodeURIComponent(value)}; path=/; expires=${expires.toUTCString()}; SameSite=Lax; Secure`;
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') return;
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? cookieStorage : undefined,
    flowType: 'pkce',
  }
});

// Helper function to check if email is from VIT
export const isVITEmail = (email: string): boolean => {
  const lowerEmail = email.toLowerCase();
  return lowerEmail.endsWith('@vitstudent.ac.in') || lowerEmail.endsWith('@vit.ac.in');
};

// Helper function to get a valid, refreshed access token
export const getValidAccessToken = async (): Promise<string | null> => {
  try {
    // First, try to get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('No session found:', sessionError);
      return null;
    }

    // Check if the token is expired or about to expire (within 60 seconds)
    const expiresAt = session.expires_at;
    const currentTime = Math.floor(Date.now() / 1000);
    
    // If token is expired or expiring soon, refresh it
    if (expiresAt && expiresAt - currentTime < 60) {
      console.log('Token expired or expiring soon, refreshing...');
      const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError || !refreshedSession) {
        console.error('Failed to refresh session:', refreshError);
        return null;
      }
      
      return refreshedSession.access_token;
    }
    
    // Token is still valid
    return session.access_token;
  } catch (error) {
    console.error('Error getting valid access token:', error);
    return null;
  }
};

// Enhanced sign out function that clears all auth-related local storage
export const signOutCompletely = async () => {
  try {
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Clear all Supabase auth tokens from localStorage
    if (typeof window !== 'undefined') {
      const keysToRemove: string[] = [];
      
      // Find all Supabase auth keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('sb-')) {
          keysToRemove.push(key);
        }
      }
      
      // Remove all found keys
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Also clear session storage
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith('sb-')) {
          sessionStorage.removeItem(key);
        }
      }
    }
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};