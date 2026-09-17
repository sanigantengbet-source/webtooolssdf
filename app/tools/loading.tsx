import React from 'react';
import { Navbar } from '@/components/public/navbar';

export default function ToolsLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-[#171717] dark:text-[#ededed]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Hero skeleton */}
        <div className="text-center py-10 max-w-3xl mx-auto space-y-4">
          <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-lg mx-auto animate-pulse" />
          <div className="h-4 w-96 max-w-full bg-zinc-200 dark:bg-zinc-800 rounded mx-auto animate-pulse" />
        </div>

        {/* Search & Categories Bar skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
          <div className="h-10 w-full sm:w-80 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
          <div className="flex gap-2 w-full sm:w-auto overflow-hidden">
            <div className="h-8 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
            <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
            <div className="h-8 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Grid cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4 bg-zinc-50 dark:bg-zinc-900/40"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-3.5 w-4/5 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
