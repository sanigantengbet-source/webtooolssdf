'use client';

import React, { useSyncExternalStore } from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from './theme-provider';

const emptySubscribe = () => () => {};

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
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

  return (
    <button
      id="theme-toggle-btn"
      onClick={cycleTheme}
      type="button"
      aria-label={`Current theme: ${theme}. Click to switch theme`}
      className={`inline-flex items-center justify-center h-8 w-8 rounded-md border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#ededed] hover:bg-[#fafafa] dark:hover:bg-[#1f1f1f] transition-colors focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white ${className}`}
      title={`Theme: ${theme}`}
    >
      {theme === 'light' && <Sun className="h-4 w-4" />}
      {theme === 'dark' && <Moon className="h-4 w-4" />}
      {theme === 'system' && <Laptop className="h-4 w-4" />}
    </button>
  );
}
