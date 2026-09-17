import React from 'react';
import { Navbar } from '@/components/public/navbar';
import { Hero } from '@/components/public/hero';
import { PublicToolsView } from '@/components/public/public-tools-view';
import { SupabaseBanner } from '@/components/public/supabase-banner';
import { Footer } from '@/components/public/footer';
import { getSupabaseEnv } from '@/lib/supabase/config';
import { getServerSupabase } from '@/lib/supabase/server';
import { getServiceRoleSupabase } from '@/lib/supabase/service-role';
import type { Tool, Category } from '@/lib/types';

export const revalidate = 0; // Ensures fresh data while Supabase Realtime handles live updates

async function getInitialData(): Promise<{
  tools: Tool[];
  categories: Category[];
  isConfigured: boolean;
}> {
  const env = getSupabaseEnv();
  if (!env.isConfigured) {
    return { tools: [], categories: [], isConfigured: false };
  }

  const supabase = (await getServerSupabase()) || getServiceRoleSupabase();
  if (!supabase) {
    return { tools: [], categories: [], isConfigured: false };
  }

  try {
    const [{ data: rawTools }, { data: rawCategories }] = await Promise.all([
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
        .neq('status', 'archived')
        .order('is_featured', { ascending: false })
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false }),
      supabase
        .from('categories')
        .select('id, name, slug, description, tool_categories(count)')
        .order('name', { ascending: true }),
    ]);

    const tools: Tool[] = (rawTools || []).map((t: any) => ({
      ...t,
      categories: (t.tool_categories || []).map((tc: any) => tc.categories).filter(Boolean),
      tags: (t.tool_tags || []).map((tt: any) => tt.tags).filter(Boolean),
      tool_categories: undefined,
      tool_tags: undefined,
    }));

    const categories: Category[] = (rawCategories || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      tool_count: c.tool_categories?.[0]?.count || 0,
    }));

    return { tools, categories, isConfigured: true };
  } catch (error) {
    console.error('Error fetching initial public data:', error);
    return { tools: [], categories: [], isConfigured: true };
  }
}

export default async function ToolsDirectoryPage() {
  const { tools, categories, isConfigured } = await getInitialData();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-[#171717] dark:text-[#ededed]">
      <SupabaseBanner isConfigured={isConfigured} />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <PublicToolsView
          initialTools={tools}
          initialCategories={categories}
          isConfigured={isConfigured}
        />
      </main>

      <Footer />
    </div>
  );
}
