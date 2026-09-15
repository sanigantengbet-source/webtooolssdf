// Safe helper to check if Supabase environment variables are configured
export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  const isConfigured = Boolean(
    url &&
    anonKey &&
    !url.includes('your-project.supabase.co') &&
    anonKey !== 'your-anon-key-here'
  );

  const hasServiceRole = Boolean(
    serviceRoleKey &&
    serviceRoleKey !== 'your-service-role-key-here'
  );

  return {
    url,
    anonKey,
    serviceRoleKey,
    isConfigured,
    hasServiceRole,
  };
}
