import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validation/schemas';
import { checkLoginRateLimit, recordLoginAttempt, recordAuditLog } from '@/lib/security/rate-limit';
import { resolveUsernameToAuthEmail } from '@/lib/auth/admin-auth';
import { getServerSupabase } from '@/lib/supabase/server';

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || '127.0.0.1';
}

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req);

  try {
    const body = await req.json();
    const parseResult = loginSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password format.' },
        { status: 400 }
      );
    }

    const { username, password } = parseResult.data;

    // 1. Check Rate Limiting & Brute Force Lockout
    const rateLimit = await checkLoginRateLimit(username, clientIp);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: rateLimit.message || 'Too many failed login attempts. Please try again later.',
          retryAfterSeconds: rateLimit.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds || 60),
          },
        }
      );
    }

    // 2. Resolve username to internal Auth email
    const resolved = await resolveUsernameToAuthEmail(username);
    if (!resolved) {
      // Record failure without revealing username validity
      await recordLoginAttempt(username, clientIp, false);
      await recordAuditLog({
        action: 'LOGIN_FAILED',
        targetType: 'auth',
        metadata: { username, reason: 'unresolved_account' },
        clientIp,
      });

      return NextResponse.json(
        { success: false, message: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    // 3. Authenticate with Supabase Auth using server client so cookies are written
    const supabase = await getServerSupabase();
    if (!supabase) {
      return NextResponse.json(
        { success: false, message: 'Supabase service is not configured.' },
        { status: 503 }
      );
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: resolved.email,
      password,
    });

    if (authError) {
      await recordLoginAttempt(username, clientIp, false);
      await recordAuditLog({
        action: 'LOGIN_FAILED',
        targetType: 'auth',
        targetId: resolved.userId,
        metadata: { username, error: authError.message },
        clientIp,
      });

      return NextResponse.json(
        { success: false, message: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    // 4. Record Successful Login
    await recordLoginAttempt(username, clientIp, true);
    await recordAuditLog({
      action: 'LOGIN_SUCCESS',
      targetType: 'auth',
      targetId: resolved.userId,
      adminId: resolved.userId,
      metadata: { username },
      clientIp,
    });

    return NextResponse.json({
      success: true,
      mustChangePassword: resolved.mustChangePassword,
    });
  } catch (error) {
    console.error('Error during login handler:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}
