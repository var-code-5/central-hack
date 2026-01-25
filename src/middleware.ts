import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  console.log('🔍 Middleware executing for path:', req.nextUrl.pathname);

  // Get Supabase credentials
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  
  console.log('📦 Project Reference:', projectRef);
  
  if (!projectRef) {
    console.error('❌ Could not extract project reference from Supabase URL');
    return res;
  }

  // Get the auth token from cookies
  const authCookieName = `sb-${projectRef}-auth-token`;
  const authCookie = req.cookies.get(authCookieName);

  console.log('🍪 Auth Cookie Name:', authCookieName);
  console.log('🍪 Auth Cookie exists:', !!authCookie);

  let hasValidSession = false;

  // Verify the token with Supabase
  if (authCookie?.value) {
    try {
      console.log('🔓 Attempting to parse cookie data...');
      const cookieData = JSON.parse(authCookie.value);
      const accessToken = cookieData?.[0]; // Access token is the first element in the array
      
      console.log('🔑 Access Token found:', !!accessToken);
      
      if (accessToken) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
          global: {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        });

        console.log('⏳ Verifying session with Supabase...');
        // Verify the session is valid
        const { data: { user }, error } = await supabase.auth.getUser(accessToken);
        hasValidSession = !!user && !error;
        
        console.log('✅ Session valid:', hasValidSession);
        if (error) console.error('❌ Supabase auth error:', error.message);
        if (user) console.log('👤 User ID:', user.id);
      }
    } catch (error) {
      console.error('❌ Error verifying session:', error);
      hasValidSession = false;
    }
  } else {
    console.log('⚠️ No auth cookie found');
  }

  console.log('🔐 Has valid session:', hasValidSession);

  // Protected routes that require authentication
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    console.log('🛡️ Checking dashboard access...');
    if (!hasValidSession) {
      console.log('🚫 Redirecting to /login - no valid session');
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/login', req.url));
    }
    console.log('✅ Dashboard access granted');
  }

  // Redirect to dashboard if already logged in and trying to access login
  if (req.nextUrl.pathname === '/login') {
    console.log('🔑 User on login page...');
    if (hasValidSession) {
      console.log('↪️ Redirecting to /dashboard - already logged in');
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    console.log('✅ Showing login page');
  }

  console.log('✅ Middleware complete\n');
  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
