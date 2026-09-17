import React from 'react';

export default function RootLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-[#171717] dark:text-[#ededed]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-zinc-300 dark:border-zinc-700 border-t-emerald-500 animate-spin" />
        <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">Loading...</span>
      </div>
    </div>
  );
}
