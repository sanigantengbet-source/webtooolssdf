import React from 'react';
import { Navbar } from '@/components/public/navbar';

export default function CreditsLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-[#171717] dark:text-[#ededed]">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
        <div className="h-4 w-36 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        <div className="space-y-4">
          <div className="h-10 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
          <div className="h-5 w-full bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-5 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-5 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
      </main>
    </div>
  );
}
