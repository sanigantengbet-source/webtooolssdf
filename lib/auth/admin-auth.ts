import { getServerSupabase } from '../supabase/server';
import { getServiceRoleSupabase } from '../supabase/service-role';
import type { AdminProfile } from '../types';

export interface AdminSession {
  user: {
    id: string;
    email?: string;
  };
  profile: AdminProfile;
}

/**
 * Validates the currently authenticated session and verifies the user has the 'admin' role.
 * Runs strictly server-side.
 */
export async function getAuthenticatedAdmin(): Promise<AdminSession | null> {
  const supabase = await getServerSupabase();
  if (!supabase) return null;

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    // Verify role in profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, role, must_change_password, created_at, updated_at')
      .eq('id', user.id)
      .eq('role', 'admin')
      .single();

    if (profileError || !profile) {
      return null;
    }

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      profile: profile as AdminProfile,
    };
  } catch (err) {
    console.error('Error verifying admin session:', err);
    return null;
  }
}

/**
 * Checks if at least one admin account has been provisioned in the database.
 */
export async function checkIfAdminExists(): Promise<boolean> {
  const serviceClient = getServiceRoleSupabase();
  if (!serviceClient) return false;

  try {
    const { count, error } = await serviceClient
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'admin');

    if (error) return false;
    return (count || 0) > 0;
  } catch {
    return false;
  }
}

/**
 * Resolves a username to its corresponding Supabase Auth user email strictly server-side.
 * Used for admin login by username without exposing emails to clients.
 */
export async function resolveUsernameToAuthEmail(
  username: string
): Promise<{ email: string; userId: string; mustChangePassword: boolean } | null> {
  const serviceClient = getServiceRoleSupabase();
  if (!serviceClient) return null;

  const normalized = username.trim().toLowerCase();

  try {
    // 1. Look up profile
    const { data: profile, error: profileError } = await serviceClient
      .from('profiles')
      .select('id, username, role, must_change_password')
      .ilike('username', normalized)
      .eq('role', 'admin')
      .single();

    if (profileError || !profile) {
      return null;
    }

    // 2. Fetch auth user record by ID via service role admin API
    const { data: userData, error: userError } = await serviceClient.auth.admin.getUserById(profile.id);

    if (userError || !userData?.user?.email) {
      return null;
    }

    return {
      email: userData.user.email,
      userId: profile.id,
      mustChangePassword: profile.must_change_password,
    };
  } catch (err) {
    console.error('Error resolving username to email:', err);
    return null;
  }
}
