import { NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/auth/admin-auth';
import { getServiceRoleSupabase } from '@/lib/supabase/service-role';

export async function GET() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getServiceRoleSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database service unavailable' }, { status: 503 });
  }

  try {
    const [
      { data: tools },
      { count: totalCategories },
      { count: totalTags },
      { data: recentLogs },
    ] = await Promise.all([
      supabase.from('tools').select('status, is_featured'),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('tags').select('*', { count: 'exact', head: true }),
      supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(6),
    ]);

    const toolList = tools || [];
    const stats = {
      totalTools: toolList.length,
      activeTools: toolList.filter((t) => t.status === 'active').length,
      maintenanceTools: toolList.filter((t) => t.status === 'maintenance').length,
      comingSoonTools: toolList.filter((t) => t.status === 'coming_soon').length,
      archivedTools: toolList.filter((t) => t.status === 'archived').length,
      featuredTools: toolList.filter((t) => t.is_featured).length,
      totalCategories: totalCategories || 0,
      totalTags: totalTags || 0,
    };

    return NextResponse.json({
      stats,
      recentActivity: recentLogs || [],
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
