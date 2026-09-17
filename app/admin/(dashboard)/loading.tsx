import React from 'react';

export default function AdminDashboardLoading() {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse" />
          <div className="h-4 w-72 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="h-9 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse" />
      </div>

      {/* Metrics or Filters skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 space-y-2"
          >
            <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            <div className="h-7 w-16 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-[#111111]">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between">
          <div className="h-8 w-60 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-40 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                  <div className="h-3 w-28 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              <div className="h-8 w-20 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
