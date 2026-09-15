import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/auth/admin-auth';
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

async function handleUpdateSettings(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const serviceClient = getServiceRoleSupabase();
  if (!serviceClient) {
    return NextResponse.json({ error: 'Service role client unavailable' }, { status: 500 });
  }

  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action;

    // Fetch user from auth to get their current email
    const { data: authUserData } = await serviceClient.auth.admin.getUserById(admin.user.id);
    const currentAuthEmail =
      authUserData?.user?.email ||
      admin.user.email ||
      `${admin.profile.username}@toolcollection.local`;

    // CASE 1: Change Username
    if (action === 'change_username' || (body.newUsername && !body.newPassword && !body.currentPassword)) {
      const rawUsername = body.newUsername || body.username || '';
      const newUsernameClean = String(rawUsername).trim().toLowerCase();

      if (!newUsernameClean || newUsernameClean.length < 3) {
        return NextResponse.json(
          { error: 'Username must be at least 3 characters long.' },
          { status: 400 }
        );
      }
      if (newUsernameClean.length > 50) {
        return NextResponse.json(
          { error: 'Username cannot exceed 50 characters.' },
          { status: 400 }
        );
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(newUsernameClean)) {
        return NextResponse.json(
          { error: 'Username can only contain letters, numbers, hyphens, and underscores.' },
          { status: 400 }
        );
      }

      // Check if username already taken by another account
      const { data: existingUser } = await serviceClient
        .from('profiles')
        .select('id')
        .ilike('username', newUsernameClean)
        .neq('id', admin.user.id)
        .maybeSingle();

      if (existingUser) {
        return NextResponse.json(
          { error: 'Username is already taken by another account' },
          { status: 409 }
        );
      }

      // Update profiles table
      const { error: updateProfileErr } = await serviceClient
        .from('profiles')
        .update({ username: newUsernameClean })
        .eq('id', admin.user.id);

      if (updateProfileErr) {
        return NextResponse.json(
          { error: `Failed to update username: ${updateProfileErr.message}` },
          { status: 500 }
        );
      }

      // Sync auth email & metadata
      const newInternalEmail = `${newUsernameClean}@toolcollection.local`;
      await serviceClient.auth.admin.updateUserById(admin.user.id, {
        email: newInternalEmail,
        user_metadata: {
          ...(authUserData?.user?.user_metadata || {}),
          username: newUsernameClean,
        },
      });

      await recordAuditLog({
        action: 'CHANGE_USERNAME',
        targetType: 'profile',
        targetId: admin.user.id,
        adminId: admin.user.id,
        metadata: { oldUsername: admin.profile.username, newUsername: newUsernameClean },
        clientIp,
      });

      return NextResponse.json({
        success: true,
        message: 'Username updated successfully',
        username: newUsernameClean,
      });
    }

    // CASE 2: Change Password
    if (action === 'change_password' || body.newPassword) {
      const currentPassword = String(body.currentPassword || '');
      const newPassword = String(body.newPassword || '');

      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Please enter your current password.' },
          { status: 400 }
        );
      }

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { error: 'New password must be at least 6 characters long.' },
          { status: 400 }
        );
      }

      // Verify current password
      const serverSupabase = await getServerSupabase();
      let verified = false;

      if (serverSupabase) {
        // Attempt 1: with currentAuthEmail
        const { error: verifyErr1 } = await serverSupabase.auth.signInWithPassword({
          email: currentAuthEmail,
          password: currentPassword,
        });

        if (!verifyErr1) {
          verified = true;
        } else {
          // Attempt 2: with profile username email
          const profileEmail = `${admin.profile.username}@toolcollection.local`;
          if (profileEmail !== currentAuthEmail) {
            const { error: verifyErr2 } = await serverSupabase.auth.signInWithPassword({
              email: profileEmail,
              password: currentPassword,
            });
            if (!verifyErr2) {
              verified = true;
            }
          }
        }
      }

      if (!verified) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      // Update password in Supabase Auth
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

      // Refresh current session with the new password
      if (serverSupabase) {
        await serverSupabase.auth.signInWithPassword({
          email: currentAuthEmail,
          password: newPassword,
        });
      }

      await recordAuditLog({
        action: 'CHANGE_PASSWORD',
        targetType: 'profile',
        targetId: admin.user.id,
        adminId: admin.user.id,
        clientIp,
      });

      return NextResponse.json({
        success: true,
        message: 'Password updated successfully',
      });
    }

    // CASE 3: General credentials update (both username and/or password)
    if (body.username) {
      const cleanUser = String(body.username).trim().toLowerCase();
      if (cleanUser && cleanUser !== admin.profile.username.toLowerCase()) {
        await serviceClient
          .from('profiles')
          .update({ username: cleanUser })
          .eq('id', admin.user.id);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  return handleUpdateSettings(req);
}

export async function PATCH(req: NextRequest) {
  return handleUpdateSettings(req);
}
