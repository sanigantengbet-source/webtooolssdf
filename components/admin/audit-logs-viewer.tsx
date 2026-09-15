'use client';

import React, { useState } from 'react';
import { Filter, RefreshCw, Clock, Terminal } from 'lucide-react';
import type { AuditLog } from '@/lib/types';

interface AuditLogsViewerProps {
  initialLogs: AuditLog[];
}

export function AuditLogsViewer({ initialLogs }: AuditLogsViewerProps) {
  const [logs, setLogs] = useState<AuditLog[]>(initialLogs);
  const [actionFilter, setActionFilter] = useState('all');
  const [targetTypeFilter, setTargetTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (actionFilter !== 'all') params.set('action', actionFilter);
      if (targetTypeFilter !== 'all') params.set('targetType', targetTypeFilter);

      const res = await fetch(`/api/admin/audit?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesTarget =
      targetTypeFilter === 'all' || log.target_type === targetTypeFilter;
    return matchesAction && matchesTarget;
  });

  const getActionBadgeClass = (action: string) => {
    if (action.includes('CREATE')) {
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    }
    if (action.includes('DELETE')) {
      return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
    }
    if (action.includes('UPDATE') || action.includes('CHANGE')) {
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    }
    if (action.includes('LOGIN_FAILED')) {
      return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
    }
    return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eaeaea] dark:border-[#27272a]">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#171717] dark:text-[#ededed]">
            Security & Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] dark:text-[#a1a1a1] mt-1">
            Immutable trace of administrative mutations, authentication attempts, and system actions
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] hover:bg-[#fafafa] dark:hover:bg-[#181818] transition-colors shrink-0"
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap text-xs">
        <div className="flex items-center gap-1.5 text-[#666666] dark:text-[#a1a1a1]">
          <Filter className="h-3.5 w-3.5" />
          <span>Filters:</span>
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-2.5 py-1.5 text-xs rounded border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
        >
          <option value="all">All Actions</option>
          <option value="LOGIN_SUCCESS">LOGIN_SUCCESS</option>
          <option value="LOGIN_FAILED">LOGIN_FAILED</option>
          <option value="CREATE_TOOL">CREATE_TOOL</option>
          <option value="UPDATE_TOOL">UPDATE_TOOL</option>
          <option value="DELETE_TOOL">DELETE_TOOL</option>
          <option value="CREATE_CATEGORY">CREATE_CATEGORY</option>
          <option value="UPDATE_CATEGORY">UPDATE_CATEGORY</option>
          <option value="DELETE_CATEGORY">DELETE_CATEGORY</option>
          <option value="CHANGE_PASSWORD">CHANGE_PASSWORD</option>
          <option value="CHANGE_USERNAME">CHANGE_USERNAME</option>
          <option value="BOOTSTRAP_ADMIN">BOOTSTRAP_ADMIN</option>
          <option value="UPLOAD_ASSET">UPLOAD_ASSET</option>
        </select>

        <select
          value={targetTypeFilter}
          onChange={(e) => setTargetTypeFilter(e.target.value)}
          className="px-2.5 py-1.5 text-xs rounded border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
        >
          <option value="all">All Targets</option>
          <option value="tool">tool</option>
          <option value="category">category</option>
          <option value="tag">tag</option>
          <option value="admin">admin</option>
          <option value="system">system</option>
          <option value="asset">asset</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="rounded-lg border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#eaeaea] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#161616] text-[#666666] dark:text-[#a1a1a1]">
              <tr>
                <th className="py-3 px-4 font-medium">Timestamp</th>
                <th className="py-3 px-4 font-medium">Action</th>
                <th className="py-3 px-4 font-medium">Target</th>
                <th className="py-3 px-4 font-medium">IP Hash / Client</th>
                <th className="py-3 px-4 font-medium text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaeaea] dark:divide-[#27272a]">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  const dateStr = new Date(log.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  const timeStr = new Date(log.created_at).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  });

                  const isExpanded = expandedLogId === log.id;

                  return (
                    <React.Fragment key={log.id}>
                      <tr className="hover:bg-[#fafafa] dark:hover:bg-[#141414] transition-colors">
                        {/* Timestamp */}
                        <td className="py-3 px-4 font-mono text-[11px] text-[#666666] dark:text-[#a1a1a1]">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            <span>
                              {dateStr} {timeStr}
                            </span>
                          </div>
                        </td>

                        {/* Action Badge */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${getActionBadgeClass(
                              log.action
                            )}`}
                          >
                            {log.action}
                          </span>
                        </td>

                        {/* Target */}
                        <td className="py-3 px-4">
                          <span className="font-medium text-[#171717] dark:text-[#ededed]">
                            {log.target_type}
                          </span>
                          {log.target_id && (
                            <span className="ml-1 text-[11px] font-mono text-[#666666] dark:text-[#a1a1a1]">
                              ({log.target_id.slice(0, 8)}...)
                            </span>
                          )}
                        </td>

                        {/* Client IP */}
                        <td className="py-3 px-4 font-mono text-[11px] text-[#666666] dark:text-[#a1a1a1]">
                          {log.client_ip ? log.client_ip.slice(0, 16) : 'unknown'}
                        </td>

                        {/* Metadata Toggle */}
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() =>
                              setExpandedLogId(isExpanded ? null : log.id)
                            }
                            className="text-[11px] font-mono text-[#666666] dark:text-[#a1a1a1] hover:text-black dark:hover:text-white underline underline-offset-2"
                          >
                            {isExpanded ? 'Hide' : 'Inspect'}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Metadata Row */}
                      {isExpanded && (
                        <tr className="bg-[#fafafa] dark:bg-[#141414]">
                          <td colSpan={5} className="p-4">
                            <div className="p-3 rounded bg-black text-emerald-400 font-mono text-[11px] overflow-x-auto border border-zinc-800">
                              <div className="flex items-center gap-2 text-zinc-400 mb-1 pb-1 border-b border-zinc-800">
                                <Terminal className="h-3 w-3" />
                                <span>Event Payload Snapshot</span>
                              </div>
                              <pre>{JSON.stringify(log.metadata, null, 2)}</pre>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-xs text-[#666666] dark:text-[#a1a1a1]"
                  >
                    No audit records matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
