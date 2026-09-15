import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { getServiceRoleSupabase } from '@/lib/supabase/service-role';

export async function GET() {
  const supabase = (await getServerSupabase()) || getServiceRoleSupabase();

  if (!supabase) {
    return NextResponse.json({
      categories: [],
      configured: false,
    });
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, description, tool_categories(count)')
      .order('name', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const categories = (data || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      tool_count: c.tool_categories?.[0]?.count || 0,
    }));

    return NextResponse.json({ categories, configured: true });
  } catch (error) {
    console.error('Error fetching public categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
