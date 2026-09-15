import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/auth/admin-auth';
import { categorySchema } from '@/lib/validation/schemas';
import { getServiceRoleSupabase } from '@/lib/supabase/service-role';
import { recordAuditLog } from '@/lib/security/rate-limit';

export async function GET() {
  const supabase = getServiceRoleSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database service unavailable' }, { status: 503 });
  }

  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*, tool_categories(count)')
      .order('name', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formatted = (categories || []).map((c: any) => ({
      ...c,
      tool_count: c.tool_categories?.[0]?.count || 0,
      tool_categories: undefined,
    }));

    return NextResponse.json({ categories: formatted });
  } catch (error) {
    console.error('Error fetching categories:', error);
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
    const parseResult = categorySchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    const { name, slug, description } = parseResult.data;

    // Check slug uniqueness
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: `A category with slug '${slug}' already exists` },
        { status: 409 }
      );
    }

    const { data: inserted, error: insertError } = await supabase
      .from('categories')
      .insert({ name, slug, description: description || '' })
      .select()
      .single();

    if (insertError || !inserted) {
      return NextResponse.json({ error: insertError?.message || 'Failed to create category' }, { status: 500 });
    }

    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    await recordAuditLog({
      action: 'CREATE_CATEGORY',
      targetType: 'category',
      targetId: inserted.id,
      adminId: admin.user.id,
      metadata: { name, slug },
      clientIp,
    });

    return NextResponse.json({ success: true, category: inserted }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
