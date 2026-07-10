import { NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  // Update the Supabase session (refreshes the token if needed).
  // If auth refresh is misconfigured in a deployment, keep the public site alive.
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    supabaseResponse = await updateSession(request);
  } catch (error) {
    console.error('Supabase middleware failed:', error);
  }

  // Existing Admin Protection Logic
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }

    try {
      // Fail closed: without a configured secret, no token can be trusted
      if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not configured');
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
    } catch (err) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
