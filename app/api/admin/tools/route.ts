import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/auth/admin-auth';
import { toolSchema } from '@/lib/validation/schemas';
import { getServiceRoleSupabase } from '@/lib/supabase/service-role';
import { recordAuditLog } from '@/lib/security/rate-limit';

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
  const search = searchParams.get('q')?.trim();
  const status = searchParams.get('status')?.trim();
  const categoryId = searchParams.get('category')?.trim();

  try {
    let query = supabase
      .from('tools')
      .select(`
        *,
        tool_categories (
          category_id,
          categories (id, name, slug)
        ),
        tool_tags (
          tag_id,
          tags (id, name, slug)
        )
      `)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,short_description.ilike.%${search}%,slug.ilike.%${search}%`);
    }

    const { data: rawTools, error } = await query;

    if (error) {
      console.error('Error fetching admin tools:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Format nested junctions into clean categories and tags arrays
    const tools = (rawTools || []).map((t: any) => {
      const categories = (t.tool_categories || []).map((tc: any) => tc.categories).filter(Boolean);
      const tags = (t.tool_tags || []).map((tt: any) => tt.tags).filter(Boolean);

      return {
        ...t,
        tool_categories: undefined,
        tool_tags: undefined,
        categories,
        tags,
      };
    });

    // Optional category filtering on junction result
    const filteredTools = categoryId && categoryId !== 'all'
      ? tools.filter((t: any) => t.categories.some((c: any) => c.id === categoryId))
      : tools;

    return NextResponse.json({ tools: filteredTools });
  } catch (error) {
    console.error('Unexpected error listing tools:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getServiceRoleSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database service unavailable' }, { status: 503 });
  }

  try {
    const body = await req.json();
    const parseResult = toolSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    const {
      name,
      slug,
      short_description,
      description,
      website_url,
      github_url,
      documentation_url,
      logo_url,
      thumbnail_url,
      status,
      is_featured,
      sort_order,
      category_ids,
      tag_ids,
    } = parseResult.data;

    // Check slug uniqueness
    const { data: existingSlug } = await supabase
      .from('tools')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingSlug) {
      return NextResponse.json(
        { error: `A tool with slug '${slug}' already exists` },
        { status: 409 }
      );
    }

    // 1. Insert tool
    const { data: insertedTool, error: insertError } = await supabase
      .from('tools')
      .insert({
        name,
        slug,
        short_description,
        description,
        website_url,
        github_url: github_url || '',
        documentation_url: documentation_url || '',
        logo_url: logo_url || '',
        thumbnail_url: thumbnail_url || '',
        status,
        is_featured,
        sort_order,
      })
      .select()
      .single();

    if (insertError || !insertedTool) {
      return NextResponse.json(
        { error: insertError?.message || 'Failed to create tool' },
        { status: 500 }
      );
    }

    const toolId = insertedTool.id;

    // 2. Insert category junctions
    if (category_ids && category_ids.length > 0) {
      const catInserts = category_ids.map((catId: string) => ({
        tool_id: toolId,
        category_id: catId,
      }));
      await supabase.from('tool_categories').insert(catInserts);
    }

    // 3. Insert tag junctions
    if (tag_ids && tag_ids.length > 0) {
      const tagInserts = tag_ids.map((tagId: string) => ({
        tool_id: toolId,
        tag_id: tagId,
      }));
      await supabase.from('tool_tags').insert(tagInserts);
    }

    // 4. Audit Log
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    await recordAuditLog({
      action: 'CREATE_TOOL',
      targetType: 'tool',
      targetId: toolId,
      adminId: admin.user.id,
      metadata: { name, slug, status },
      clientIp,
    });

    return NextResponse.json({ success: true, tool: insertedTool }, { status: 201 });
  } catch (error) {
    console.error('Error creating tool:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
