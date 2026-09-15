import React from 'react';
import Link from 'next/link';
import {
  Wrench,
  CheckCircle2,
  AlertCircle,
  Clock,
  Archive,
  Layers,
  Tag,
  Plus,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { getServiceRoleSupabase } from '@/lib/supabase/service-role';
import type { AuditLog } from '@/lib/types';

export const revalidate = 0;

async function getDashboardData() {
  const supabase = getServiceRoleSupabase();
  if (!supabase) {
    return {
      stats: {
        totalTools: 0,
        activeTools: 0,
        maintenanceTools: 0,
        comingSoonTools: 0,
        archivedTools: 0,
        totalCategories: 0,
        totalTags: 0,
      },
      recentLogs: [] as AuditLog[],
    };
  }

  try {
    const [
      { data: tools },
      { count: catCount },
      { count: tagCount },
      { data: logs },
    ] = await Promise.all([
      supabase.from('tools').select('status'),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('tags').select('*', { count: 'exact', head: true }),
      supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6),
    ]);

    const toolList = tools || [];
    return {
      stats: {
        totalTools: toolList.length,
        activeTools: toolList.filter((t) => t.status === 'active').length,
        maintenanceTools: toolList.filter((t) => t.status === 'maintenance').length,
        comingSoonTools: toolList.filter((t) => t.status === 'coming_soon').length,
        archivedTools: toolList.filter((t) => t.status === 'archived').length,
        totalCategories: catCount || 0,
        totalTags: tagCount || 0,
      },
      recentLogs: (logs || []) as AuditLog[],
    };
  } catch (error) {
    console.error('Error in getDashboardData:', error);
    return {
      stats: {
        totalTools: 0,
        activeTools: 0,
        maintenanceTools: 0,
        comingSoonTools: 0,
        archivedTools: 0,
        totalCategories: 0,
        totalTags: 0,
      },
      recentLogs: [] as AuditLog[],
    };
  }
}

export default async function AdminDashboardPage() {
  const { stats, recentLogs } = await getDashboardData();

  const statCards = [
    {
      title: 'Total Tools',
      value: stats.totalTools,
      icon: Wrench,
      description: 'All catalog entries',
      href: '/admin/tools',
    },
    {
      title: 'Active Tools',
      value: stats.activeTools,
      icon: CheckCircle2,
      description: 'Publicly visible and online',
      href: '/admin/tools?status=active',
    },
    {
      title: 'Under Maintenance',
      value: stats.maintenanceTools,
      icon: AlertCircle,
      description: 'Marked for servicing',
      href: '/admin/tools?status=maintenance',
    },
    {
      title: 'Coming Soon',
      value: stats.comingSoonTools,
      icon: Clock,
      description: 'Upcoming projects',
      href: '/admin/tools?status=coming_soon',
    },
    {
      title: 'Archived',
      value: stats.archivedTools,
      icon: Archive,
      description: 'Hidden from public feed',
      href: '/admin/tools?status=archived',
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: Layers,
      description: 'Taxonomy classifications',
      href: '/admin/categories',
    },
    {
      title: 'Tags',
      value: stats.totalTags,
      icon: Tag,
      description: 'Searchable keywords',
      href: '/admin/tags',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eaeaea] dark:border-[#27272a]">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#171717] dark:text-[#ededed]">
            Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] dark:text-[#a1a1a1] mt-1">
            Real-time status of your tools collection and system operations
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/tools?action=new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-medium bg-[#171717] text-white dark:bg-[#ededed] dark:text-black hover:opacity-90 transition-opacity"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Tool</span>
          </Link>
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-medium border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#ededed] hover:bg-[#fafafa] dark:hover:bg-[#181818] transition-colors"
          >
            <Layers className="h-3.5 w-3.5 text-zinc-500" />
            <span>Categories</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group p-4 rounded-lg border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
            >
              <div className="flex items-center justify-between text-[#666666] dark:text-[#a1a1a1] mb-2">
                <span className="text-xs font-medium">{card.title}</span>
                <Icon className="h-4 w-4" />
              </div>
              <div className="text-2xl font-bold font-mono tracking-tight text-[#171717] dark:text-[#ededed]">
                {card.value}
              </div>
              <p className="text-[11px] text-[#666666] dark:text-[#a1a1a1] mt-1 truncate">
                {card.description}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity Audit Preview */}
      <div className="rounded-lg border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] p-5">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#eaeaea] dark:border-[#27272a]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-zinc-500" />
            <h2 className="text-sm font-semibold text-[#171717] dark:text-[#ededed]">
              Recent Audit Log
            </h2>
          </div>
          <Link
            href="/admin/audit"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#666666] dark:text-[#a1a1a1] hover:text-[#171717] dark:hover:text-[#ededed]"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {recentLogs.length > 0 ? (
          <div className="divide-y divide-[#eaeaea] dark:divide-[#27272a]">
            {recentLogs.map((log) => {
              const dateStr = new Date(log.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={log.id}
                  className="py-2.5 flex items-center justify-between text-xs gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#fafafa] dark:bg-[#181818] border border-[#eaeaea] dark:border-[#27272a] text-[#171717] dark:text-[#ededed]">
                      {log.action}
                    </span>
                    <span className="text-[#666666] dark:text-[#a1a1a1] truncate">
                      Target: <strong className="text-[#171717] dark:text-[#ededed]">{log.target_type}</strong>{' '}
                      {log.target_id && `(${log.target_id.slice(0, 8)}...)`}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[#666666] dark:text-[#a1a1a1] shrink-0">
                    {dateStr}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-[#666666] dark:text-[#a1a1a1]">
            No administrative events recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}
