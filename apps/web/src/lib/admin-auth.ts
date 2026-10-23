import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const ADMIN_COOKIE_NAME = 'floww_admin_session';

function getAdminSecret(): string {
  return process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET || 'floww2026';
}

function safeEqualStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function getAdminSessionToken(): string {
  const secret = getAdminSecret();
  return crypto.createHmac('sha256', secret).update('floww-admin-v1').digest('hex');
}

export function verifyAdminPassword(password: string): boolean {
  if (!password || typeof password !== 'string') return false;
  const secret = getAdminSecret();
  return safeEqualStrings(password.trim(), secret);
}

export function isAdminAuthenticated(request: NextRequest): boolean {
  const secret = getAdminSecret();
  const expectedToken = getAdminSessionToken();

  // 1. Check HttpOnly HMAC session cookie
  const cookieVal = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (cookieVal && safeEqualStrings(cookieVal, expectedToken)) {
    return true;
  }

  // 2. Check x-admin-key header
  const adminKeyHeader = request.headers.get('x-admin-key');
  if (adminKeyHeader && safeEqualStrings(adminKeyHeader.trim(), secret)) {
    return true;
  }

  // 3. Check HTTP Basic Auth header (Authorization: Basic base64(user:pass))
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.toLowerCase().startsWith('basic ')) {
    try {
      const decoded = Buffer.from(authHeader.slice(6).trim(), 'base64').toString('utf8');
      const colonIdx = decoded.indexOf(':');
      const password = colonIdx >= 0 ? decoded.slice(colonIdx + 1) : decoded;
      if (safeEqualStrings(password, secret)) {
        return true;
      }
    } catch {
      // Ignore malformed Basic header
    }
  }

  return false;
}

export function requireAdminAuth(request: NextRequest): NextResponse | null {
  if (isAdminAuthenticated(request)) {
    return null;
  }
  return NextResponse.json(
    {
      error: 'Krever administratorinnlogging for tilgang til Floww Command Center.',
      unauthorized: true,
    },
    { status: 401 }
  );
}

/**
 * Returns the canonical trusted application origin without ever trusting client-supplied
 * Origin or Host headers (prevents SSRF / open redirect / Stripe return URL spoofing).
 */
export function getTrustedAppOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://flowwmedia.no'
      : 'http://localhost:3000')
  ).replace(/\/$/, '');
}
