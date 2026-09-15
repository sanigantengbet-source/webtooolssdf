import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { getServiceRoleSupabase } from '@/lib/supabase/service-role';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('q')?.trim();
  const categorySlug = searchParams.get('category')?.trim();

  // Try public client first, fallback to service role if available
  const supabase = (await getServerSupabase()) || getServiceRoleSupabase();

  if (!supabase) {
    return NextResponse.json({
      tools: [],
      configured: false,
      message: 'Supabase is not configured yet.',
    });
  }

  try {
    let query = supabase
      .from('tools')
      .select(`
        id,
        name,
        slug,
        short_description,
        description,
        logo_url,
        thumbnail_url,
        website_url,
        github_url,
        documentation_url,
        status,
        is_featured,
        sort_order,
        created_at,
        updated_at,
        tool_categories (
          categories (id, name, slug)
        ),
        tool_tags (
          tags (id, name, slug)
        )
      `)
      .neq('status', 'archived')
      .order('is_featured', { ascending: false })
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`name.ilike.%${search}%,short_description.ilike.%${search}%,slug.ilike.%${search}%`);
    }

    const { data: rawTools, error } = await query;

    if (error) {
      console.error('Error fetching public tools:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let tools = (rawTools || []).map((t: any) => ({
      ...t,
      categories: (t.tool_categories || []).map((tc: any) => tc.categories).filter(Boolean),
      tags: (t.tool_tags || []).map((tt: any) => tt.tags).filter(Boolean),
      tool_categories: undefined,
      tool_tags: undefined,
    }));

    // Filter by category slug if specified
    if (categorySlug && categorySlug !== 'all') {
      tools = tools.filter((tool: any) =>
        tool.categories.some((c: any) => c.slug === categorySlug)
      );
    }

    return NextResponse.json({ tools, configured: true });
  } catch (error) {
    console.error('Error in public tools route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
