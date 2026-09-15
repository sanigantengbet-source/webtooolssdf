import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/auth/admin-auth';
import { getServiceRoleSupabase } from '@/lib/supabase/service-role';

export async function GET(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getServiceRoleSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database service unavailable' }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');
  const targetType = searchParams.get('targetType');
  const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);

  try {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (action && action !== 'all') {
      query = query.eq('action', action);
    }

    if (targetType && targetType !== 'all') {
      query = query.eq('target_type', targetType);
    }

    const { data: logs, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ logs: logs || [] });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
