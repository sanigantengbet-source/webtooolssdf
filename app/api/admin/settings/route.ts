import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/auth/admin-auth';
import { updateCredentialsSchema } from '@/lib/validation/schemas';
import { getServiceRoleSupabase } from '@/lib/supabase/service-role';
import { getServerSupabase } from '@/lib/supabase/server';
import { recordAuditLog } from '@/lib/security/rate-limit';

export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    username: admin.profile.username,
    role: admin.profile.role,
    mustChangePassword: admin.profile.must_change_password,
    createdAt: admin.profile.created_at,
  });
}

export async function PATCH(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parseResult = updateCredentialsSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    const { username, currentPassword, newPassword } = parseResult.data;
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

    // 1. Verify current password by attempting re-authentication
    const serverSupabase = await getServerSupabase();
    if (!serverSupabase) {
      return NextResponse.json({ error: 'Supabase server error' }, { status: 500 });
    }

    const { error: verifyError } = await serverSupabase.auth.signInWithPassword({
      email: admin.user.email || `${admin.profile.username}@toolcollection.local`,
      password: currentPassword,
    });

    if (verifyError) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    const serviceClient = getServiceRoleSupabase();
    if (!serviceClient) {
      return NextResponse.json({ error: 'Service role client unavailable' }, { status: 500 });
    }

    // 2. Update username if changed
    const newUsernameClean = username.trim().toLowerCase();
    if (newUsernameClean !== admin.profile.username.toLowerCase()) {
      // Check if already taken
      const { data: existingUser } = await serviceClient
        .from('profiles')
        .select('id')
        .ilike('username', newUsernameClean)
        .neq('id', admin.user.id)
        .single();

      if (existingUser) {
        return NextResponse.json(
          { error: 'Username is already taken by another account' },
          { status: 409 }
        );
      }

      const { error: updateProfileErr } = await serviceClient
        .from('profiles')
        .update({ username: newUsernameClean })
        .eq('id', admin.user.id);

      if (updateProfileErr) {
        return NextResponse.json(
          { error: 'Failed to update username' },
          { status: 500 }
        );
      }

      await recordAuditLog({
        action: 'CHANGE_USERNAME',
        targetType: 'profile',
        targetId: admin.user.id,
        adminId: admin.user.id,
        metadata: { oldUsername: admin.profile.username, newUsername: newUsernameClean },
        clientIp,
      });
    }

    // 3. Update password if provided
    if (newPassword && newPassword.length > 0) {
      const { error: updatePassErr } = await serviceClient.auth.admin.updateUserById(
        admin.user.id,
        { password: newPassword }
      );

      if (updatePassErr) {
        return NextResponse.json(
          { error: `Failed to update password: ${updatePassErr.message}` },
          { status: 500 }
        );
      }

      // Mark must_change_password as false in profiles
      await serviceClient
        .from('profiles')
        .update({ must_change_password: false })
        .eq('id', admin.user.id);

      await recordAuditLog({
        action: 'CHANGE_PASSWORD',
        targetType: 'profile',
        targetId: admin.user.id,
        adminId: admin.user.id,
        clientIp,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Credentials updated successfully',
      username: newUsernameClean,
    });
  } catch (error) {
    console.error('Error updating credentials:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
