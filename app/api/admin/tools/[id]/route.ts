import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/auth/admin-auth';
import { toolSchema } from '@/lib/validation/schemas';
import { getServiceRoleSupabase } from '@/lib/supabase/service-role';
import { recordAuditLog } from '@/lib/security/rate-limit';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getServiceRoleSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database service unavailable' }, { status: 503 });
  }

  const { id } = await params;

  try {
    const { data: tool, error } = await supabase
      .from('tools')
      .select(`
        *,
        tool_categories (category_id),
        tool_tags (tag_id)
      `)
      .eq('id', id)
      .single();

    if (error || !tool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    const category_ids = (tool.tool_categories || []).map((tc: any) => tc.category_id);
    const tag_ids = (tool.tool_tags || []).map((tt: any) => tt.tag_id);

    return NextResponse.json({
      tool: {
        ...tool,
        tool_categories: undefined,
        tool_tags: undefined,
        category_ids,
        tag_ids,
      },
    });
  } catch (error) {
    console.error('Error fetching tool:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getServiceRoleSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database service unavailable' }, { status: 503 });
  }

  const { id } = await params;

  try {
    const body = await req.json().catch(() => ({}));

    // Normalize inputs - allow every field to be completely optional
    const rawName = typeof body.name === 'string' ? body.name.trim() : '';
    const finalName = rawName || 'Untitled Tool';

    const rawSlug = typeof body.slug === 'string' ? body.slug.trim().toLowerCase() : '';
    let slugToUse =
      rawSlug ||
      finalName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') ||
      `tool-${Date.now()}`;

    const normalizedData = {
      name: finalName,
      slug: slugToUse,
      short_description: String(body.short_description ?? body.shortDescription ?? '').trim(),
      description: String(body.description ?? '').trim(),
      website_url: String(body.website_url ?? body.websiteUrl ?? '').trim(),
      github_url: String(body.github_url ?? body.githubUrl ?? '').trim(),
      documentation_url: String(body.documentation_url ?? body.documentationUrl ?? '').trim(),
      logo_url: String(body.logo_url ?? body.logoUrl ?? '').trim(),
      thumbnail_url: String(body.thumbnail_url ?? body.thumbnailUrl ?? '').trim(),
      status: body.status || 'active',
      is_featured: Boolean(body.is_featured ?? body.isFeatured ?? false),
      sort_order: Number(body.sort_order ?? body.sortOrder ?? 0),
      category_ids: Array.isArray(body.category_ids)
        ? body.category_ids
        : Array.isArray(body.categoryIds)
        ? body.categoryIds
        : [],
      tag_ids: Array.isArray(body.tag_ids)
        ? body.tag_ids
        : Array.isArray(body.tagIds)
        ? body.tagIds
        : [],
    };

    const parseResult = toolSchema.safeParse(normalizedData);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    const {
      name,
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

    // Verify slug conflict with other tools
    const { data: conflict } = await supabase
      .from('tools')
      .select('id')
      .eq('slug', slugToUse)
      .neq('id', id)
      .single();

    if (conflict) {
      slugToUse = `${slugToUse}-${Date.now().toString(36)}`;
    }

    // 1. Update tools record
    const { data: updatedTool, error: updateError } = await supabase
      .from('tools')
      .update({
        name,
        slug: slugToUse,
        short_description: short_description || '',
        description: description || '',
        website_url: website_url || '',
        github_url: github_url || '',
        documentation_url: documentation_url || '',
        logo_url: logo_url || '',
        thumbnail_url: thumbnail_url || '',
        status,
        is_featured,
        sort_order,
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // 2. Update category junctions (delete existing and insert new)
    await supabase.from('tool_categories').delete().eq('tool_id', id);
    if (category_ids && category_ids.length > 0) {
      const catInserts = category_ids.map((catId: string) => ({
        tool_id: id,
        category_id: catId,
      }));
      await supabase.from('tool_categories').insert(catInserts);
    }

    // 3. Update tag junctions (delete existing and insert new)
    await supabase.from('tool_tags').delete().eq('tool_id', id);
    if (tag_ids && tag_ids.length > 0) {
      const tagInserts = tag_ids.map((tagId: string) => ({
        tool_id: id,
        tag_id: tagId,
      }));
      await supabase.from('tool_tags').insert(tagInserts);
    }

    // 4. Audit Log
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    await recordAuditLog({
      action: 'UPDATE_TOOL',
      targetType: 'tool',
      targetId: id,
      adminId: admin.user.id,
      metadata: { name, slug: slugToUse, status },
      clientIp,
    });

    return NextResponse.json({ success: true, tool: updatedTool });
  } catch (error) {
    console.error('Error updating tool:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getServiceRoleSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database service unavailable' }, { status: 503 });
  }

  const { id } = await params;

  try {
    // Fetch tool name before deleting for audit log
    const { data: existing } = await supabase
      .from('tools')
      .select('name, slug')
      .eq('id', id)
      .single();

    // Cascading deletes on tool_categories and tool_tags happen automatically via FK
    const { error: deleteError } = await supabase.from('tools').delete().eq('id', id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    await recordAuditLog({
      action: 'DELETE_TOOL',
      targetType: 'tool',
      targetId: id,
      adminId: admin.user.id,
      metadata: { name: existing?.name || id, slug: existing?.slug || '' },
      clientIp,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tool:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
