import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

/**
 * Verifies the admin_token cookie on an API route.
 * Returns null when the request is authenticated, or a 401/500 response body
 * descriptor when it is not. Fails closed if JWT_SECRET is not configured.
 */
export async function requireAdmin(): Promise<{ status: number; error: string } | null> {
  const secretValue = process.env.JWT_SECRET;
  if (!secretValue) {
    console.error('JWT_SECRET is not configured — refusing admin API access');
    return { status: 500, error: 'Server auth is not configured' };
  }

  const token = cookies().get('admin_token')?.value;
  if (!token) return { status: 401, error: 'Unauthorized' };

  try {
    const secret = new TextEncoder().encode(secretValue);
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== 'admin') return { status: 401, error: 'Unauthorized' };
    return null;
  } catch {
    return { status: 401, error: 'Unauthorized' };
  }
}
