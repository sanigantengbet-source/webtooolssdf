import { NextRequest, NextResponse } from 'next/server';
import { checkIfAdminExists } from '@/lib/auth/admin-auth';
import { getServiceRoleSupabase } from '@/lib/supabase/service-role';
import { getSupabaseEnv } from '@/lib/supabase/config';
import { recordAuditLog } from '@/lib/security/rate-limit';

export async function GET() {
  const env = getSupabaseEnv();
  if (!env.isConfigured || !env.hasServiceRole) {
    return NextResponse.json({
      configured: false,
      hasAdmin: false,
      message: 'Supabase environment variables are not fully configured yet.',
    });
  }

  const hasAdmin = await checkIfAdminExists();
  return NextResponse.json({
    configured: true,
    hasAdmin,
  });
}

export async function POST(req: NextRequest) {
  const env = getSupabaseEnv();
  if (!env.isConfigured || !env.hasServiceRole) {
    return NextResponse.json(
      { success: false, message: 'Supabase environment variables are missing.' },
      { status: 503 }
    );
  }

  const adminExists = await checkIfAdminExists();
  if (adminExists) {
    return NextResponse.json(
      { success: false, message: 'Setup is closed. An administrator already exists.' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const username = (body.username || 'admin').trim().toLowerCase();
    const password = body.password || 'ChangeMe_123!@#';
    const isDefaultPassword = password === 'ChangeMe_123!@#';

    if (password.length < 12) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 12 characters long.' },
        { status: 400 }
      );
    }

    const serviceClient = getServiceRoleSupabase();
    if (!serviceClient) {
      return NextResponse.json(
        { success: false, message: 'Service role client unavailable.' },
        { status: 500 }
      );
    }

    // 1. Create auth user
    const internalEmail = `${username}@toolcollection.local`;
    const { data: authData, error: authError } = await serviceClient.auth.admin.createUser({
      email: internalEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        username: username,
        role: 'admin',
      },
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { success: false, message: authError?.message || 'Failed to create auth user.' },
        { status: 500 }
      );
    }

    const userId = authData.user.id;

    // 2. Insert into profiles table
    const { error: profileError } = await serviceClient.from('profiles').upsert({
      id: userId,
      username: username,
      role: 'admin',
      must_change_password: isDefaultPassword,
    });

    if (profileError) {
      // rollback auth user if profile insertion failed
      await serviceClient.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { success: false, message: `Failed to create admin profile: ${profileError.message}` },
        { status: 500 }
      );
    }

    // 3. Record Audit Log
    await recordAuditLog({
      action: 'BOOTSTRAP_ADMIN',
      targetType: 'admin',
      targetId: userId,
      adminId: userId,
      metadata: { username, isDefaultPassword },
      clientIp: req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1',
    });

    return NextResponse.json({
      success: true,
      message: 'Admin account initialized successfully.',
      username: username,
      mustChangePassword: isDefaultPassword,
    });
  } catch (error) {
    console.error('Error during admin setup:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process admin setup.' },
      { status: 500 }
    );
  }
}
