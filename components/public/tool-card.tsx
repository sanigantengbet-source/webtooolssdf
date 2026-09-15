import React from 'react';
import Link from 'next/link';
import { ExternalLink, ArrowRight, Clock, Layers } from 'lucide-react';
import type { Tool } from '@/lib/types';

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  // Format last updated date
  const updatedDate = new Date(tool.updated_at).toLocaleDateString('en-US', {
    month: 'short',
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

  const primaryCategory = tool.categories?.[0]?.name;

  return (
    <div
      id={`tool-card-${tool.id}`}
      className="group relative flex flex-col justify-between rounded-lg border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] p-5 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-200"
    >
      <div>
        {/* Header: Logo, Category & Status */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#eaeaea] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#181818] overflow-hidden">
              {tool.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={tool.logo_url}
                  alt={`${tool.name} logo`}
                  className="h-full w-full object-contain p-1"
                  loading="lazy"
                />
              ) : (
                <span className="text-sm font-semibold uppercase tracking-wider text-[#171717] dark:text-[#ededed]">
                  {tool.name.slice(0, 2)}
                </span>
              )}
            </div>
            <div>
              <Link
                href={`/tools/${tool.slug}`}
                className="font-medium text-base text-[#171717] dark:text-[#ededed] group-hover:underline underline-offset-4 focus:outline-none"
              >
                {tool.name}
              </Link>
              {primaryCategory && (
                <div className="flex items-center gap-1 text-xs text-[#666666] dark:text-[#a1a1a1] mt-0.5">
                  <Layers className="h-3 w-3" />
                  <span>{primaryCategory}</span>
                </div>
              )}
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${statusConfig.className}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dotClass}`} />
            {statusConfig.label}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-sm text-[#666666] dark:text-[#a1a1a1] line-clamp-2 leading-relaxed mb-4">
          {tool.short_description || 'No description provided.'}
        </p>

        {/* Tags */}
        {tool.tags && tool.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tool.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-0.5 text-[11px] font-mono rounded bg-[#fafafa] dark:bg-[#181818] text-[#666666] dark:text-[#a1a1a1] border border-[#eaeaea] dark:border-[#27272a]"
              >
                {tag.name}
              </span>
            ))}
            {tool.tags.length > 3 && (
              <span className="px-1.5 py-0.5 text-[10px] font-mono text-[#888888]">
                +{tool.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer: Last updated & actions */}
      <div className="pt-3 border-t border-[#eaeaea] dark:border-[#27272a] flex items-center justify-between text-xs text-[#666666] dark:text-[#a1a1a1]">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{updatedDate}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/tools/${tool.slug}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-[#171717] dark:text-[#ededed] hover:opacity-80 py-1"
          >
            Details
            <ArrowRight className="h-3 w-3" />
          </Link>

          {tool.website_url && (
            <a
              id={`open-tool-${tool.id}`}
              href={tool.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-[#171717] text-white dark:bg-[#ededed] dark:text-black hover:opacity-90 transition-opacity"
            >
              Open
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
