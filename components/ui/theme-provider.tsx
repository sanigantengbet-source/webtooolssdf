'use client';

import React, { createContext, useContext, useEffect, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => {},
});

const THEME_CHANGE_EVENT = 'tool-collection-theme-change';

function subscribeTheme(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
  };
}

function getThemeClientSnapshot(): Theme {
  try {
    const saved = localStorage.getItem('tool-collection-theme');
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
  } catch {
    // Ignore storage access errors
  }
  return 'system';
}

function getThemeServerSnapshot(): Theme {
  return 'system';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeClientSnapshot,
    getThemeServerSnapshot
  );

  // Subscribe to system preference
  const systemDark = useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      media.addEventListener('change', callback);
      return () => media.removeEventListener('change', callback);
    },
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
    () => false
  );

  const resolvedTheme: 'light' | 'dark' =
    theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
  }, [resolvedTheme]);

  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem('tool-collection-theme', newTheme);
      window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
      const root = document.documentElement;
      const isDark =
        newTheme === 'dark' ||
        (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
        root.style.colorScheme = 'light';
      }
    } catch {
      // Ignore storage access errors
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
