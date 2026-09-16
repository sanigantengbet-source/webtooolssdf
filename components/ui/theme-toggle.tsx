'use client';

import React, { useSyncExternalStore } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './theme-provider';

const emptySubscribe = () => () => {};

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  if (!isMounted) {
    return (
      <button
        id="theme-toggle-btn"
        type="button"
        aria-label="Toggle theme"
        className={`inline-flex items-center justify-center h-8 w-8 rounded-md border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#ededed] opacity-60 ${className}`}
      >
        <span className="h-4 w-4 block" />
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      type="button"
      aria-label={`Current mode: ${resolvedTheme}. Click to switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`inline-flex items-center justify-center h-8 w-8 rounded-md border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#ededed] hover:bg-[#fafafa] dark:hover:bg-[#1f1f1f] transition-colors focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white ${className}`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400" />
      ) : (
        <Moon className="h-4 w-4 text-zinc-700" />
      )}
    </button>
  );
}
