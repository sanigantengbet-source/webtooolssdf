import React from 'react';
import { getServiceRoleSupabase } from '@/lib/supabase/service-role';
import { ToolsManager } from '@/components/admin/tools-manager';
import type { Tool, Category, Tag } from '@/lib/types';

export const revalidate = 0;

async function getData() {
  const supabase = getServiceRoleSupabase();
  if (!supabase) {
    return { tools: [], categories: [], tags: [] };
  }

  try {
    const [{ data: rawTools }, { data: categories }, { data: tags }] =
      await Promise.all([
        supabase
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
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name', { ascending: true }),
        supabase.from('tags').select('*').order('name', { ascending: true }),
      ]);

    const tools: Tool[] = (rawTools || []).map((t: any) => ({
      ...t,
      categories: (t.tool_categories || []).map((tc: any) => tc.categories).filter(Boolean),
      tags: (t.tool_tags || []).map((tt: any) => tt.tags).filter(Boolean),
      tool_categories: undefined,
      tool_tags: undefined,
    }));

    return {
      tools,
      categories: (categories || []) as Category[],
      tags: (tags || []) as Tag[],
    };
  } catch (err) {
    console.error('Error fetching admin tools page data:', err);
    return { tools: [], categories: [], tags: [] };
  }
}

export default async function AdminToolsPage() {
  const { tools, categories, tags } = await getData();

  return (
    <ToolsManager
      initialTools={tools}
      categories={categories}
      tags={tags}
    />
  );
}
