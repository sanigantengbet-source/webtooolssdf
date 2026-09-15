import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  ExternalLink,
  ArrowLeft,
  Calendar,
  Clock,
  Github,
  BookOpen,
  Layers,
} from 'lucide-react';
import { Navbar } from '@/components/public/navbar';
import { Footer } from '@/components/public/footer';
import { getServerSupabase } from '@/lib/supabase/server';
import { getServiceRoleSupabase } from '@/lib/supabase/service-role';
import type { Tool } from '@/lib/types';

interface ToolDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getToolBySlug(slug: string): Promise<Tool | null> {
  const supabase = (await getServerSupabase()) || getServiceRoleSupabase();
  if (!supabase) return null;

  try {
    const { data: tool, error } = await supabase
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
      .eq('slug', slug)
      .single();

    if (error || !tool) {
      return null;
    }

    return {
      ...tool,
      categories: (tool.tool_categories || []).map((tc: any) => tc.categories).filter(Boolean),
      tags: (tool.tool_tags || []).map((tt: any) => tt.tags).filter(Boolean),
      tool_categories: undefined,
      tool_tags: undefined,
    } as Tool;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ToolDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found - Tool Collection',
      description: 'The requested tool could not be located.',
    };
  }

  return {
    title: `${tool.name} - Tool Collection`,
    description: tool.short_description || tool.description.slice(0, 150),
    openGraph: {
      title: `${tool.name} - Tool Collection`,
      description: tool.short_description || tool.description.slice(0, 150),
      images: tool.thumbnail_url || tool.logo_url ? [{ url: tool.thumbnail_url || tool.logo_url || '' }] : [],
    },
  };
}

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const createdDate = new Date(tool.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const updatedDate = new Date(tool.updated_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const statusConfig = {
    active: {
      label: 'Active',
      className: 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      dotClass: 'bg-emerald-500',
    },
    maintenance: {
      label: 'Maintenance',
      className: 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
      dotClass: 'bg-amber-500',
    },
    coming_soon: {
      label: 'Coming Soon',
      className: 'text-blue-700 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
      dotClass: 'bg-blue-500',
    },
    archived: {
      label: 'Archived',
      className: 'text-zinc-600 dark:text-zinc-400 bg-zinc-500/10 border-zinc-500/20',
      dotClass: 'bg-zinc-500',
    },
  }[tool.status] || {
    label: tool.status,
    className: 'text-zinc-600 dark:text-zinc-400 bg-zinc-500/10 border-zinc-500/20',
    dotClass: 'bg-zinc-500',
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-[#171717] dark:text-[#ededed]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#666666] dark:text-[#a1a1a1] hover:text-[#171717] dark:hover:text-[#ededed] mb-6 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to all tools
        </Link>

        {/* Tool Header Card */}
        <div className="rounded-lg border border-[#eaeaea] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#111111] p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 shrink-0 rounded-lg border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#181818] flex items-center justify-center overflow-hidden">
                {tool.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={tool.logo_url}
                    alt={`${tool.name} logo`}
                    className="h-full w-full object-contain p-2"
                  />
                ) : (
                  <span className="text-xl font-bold text-[#171717] dark:text-[#ededed]">
                    {tool.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#171717] dark:text-[#ededed]">
                    {tool.name}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${statusConfig.className}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dotClass}`} />
                    {statusConfig.label}
                  </span>
                </div>
                <p className="text-sm text-[#666666] dark:text-[#a1a1a1] mt-1">
                  {tool.short_description}
                </p>
              </div>
            </div>

            {/* Main Action CTA */}
            {tool.website_url && (
              <a
                id="tool-primary-cta"
                href={tool.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-[#171717] text-white dark:bg-[#ededed] dark:text-black hover:opacity-90 transition-opacity shrink-0"
              >
                <span>Open Website</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* Thumbnail Preview if present */}
        {tool.thumbnail_url && (
          <div className="mb-8 rounded-lg border border-[#eaeaea] dark:border-[#27272a] overflow-hidden bg-[#fafafa] dark:bg-[#111111]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tool.thumbnail_url}
              alt={`${tool.name} preview`}
              className="w-full h-auto max-h-[420px] object-cover"
            />
          </div>
        )}

        {/* Two-Column Details / Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Column: Full Description */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#666666] dark:text-[#a1a1a1] mb-2.5">
                About this Tool
              </h2>
              <div className="text-sm leading-relaxed text-[#171717] dark:text-[#ededed] whitespace-pre-wrap">
                {tool.description}
              </div>
            </div>

            {/* Technology Tags */}
            {tool.tags && tool.tags.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#666666] dark:text-[#a1a1a1] mb-2.5">
                  Technologies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2.5 py-1 text-xs font-mono rounded bg-[#fafafa] dark:bg-[#141414] text-[#171717] dark:text-[#ededed] border border-[#eaeaea] dark:border-[#27272a]"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Metadata Card */}
          <div className="space-y-5 rounded-lg border border-[#eaeaea] dark:border-[#27272a] p-5 bg-[#fafafa] dark:bg-[#111111] h-fit">
            {/* Categories */}
            {tool.categories && tool.categories.length > 0 && (
              <div>
                <span className="text-xs font-medium text-[#666666] dark:text-[#a1a1a1] block mb-1.5">
                  Categories
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {tool.categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-white dark:bg-[#181818] text-[#171717] dark:text-[#ededed] border border-[#eaeaea] dark:border-[#27272a]"
                    >
                      <Layers className="h-3 w-3 text-zinc-500" />
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* External Links */}
            <div>
              <span className="text-xs font-medium text-[#666666] dark:text-[#a1a1a1] block mb-2">
                External Resources
              </span>
              <div className="space-y-2">
                {tool.github_url && (
                  <a
                    href={tool.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-medium text-[#171717] dark:text-[#ededed] hover:underline"
                  >
                    <Github className="h-3.5 w-3.5" />
                    Source Code on GitHub
                  </a>
                )}
                {tool.documentation_url && (
                  <a
                    href={tool.documentation_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-medium text-[#171717] dark:text-[#ededed] hover:underline"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    Documentation
                  </a>
                )}
                {tool.website_url && (
                  <a
                    href={tool.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-medium text-[#171717] dark:text-[#ededed] hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Project Website
                  </a>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="pt-3 border-t border-[#eaeaea] dark:border-[#27272a] space-y-2 text-xs text-[#666666] dark:text-[#a1a1a1]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Added:
                </span>
                <span className="font-mono text-[11px]">{createdDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Updated:
                </span>
                <span className="font-mono text-[11px]">{updatedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
