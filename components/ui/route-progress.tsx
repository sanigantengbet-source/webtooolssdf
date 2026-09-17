'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const barRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Complete progress on route change
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    bar.style.width = '100%';
    bar.style.opacity = '1';

    timerRef.current = setTimeout(() => {
      bar.style.opacity = '0';
      setTimeout(() => {
        bar.style.width = '0%';
      }, 200);
    }, 150);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname, searchParams]);

  // Intercept clicks on internal links for instant visual feedback (< 2ms)
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (
        href &&
        href.startsWith('/') &&
        !href.startsWith('/#') &&
        target.target !== '_blank' &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        const currentUrl = window.location.pathname + window.location.search;
        if (href === currentUrl) return;

        const bar = barRef.current;
        if (!bar) return;

        bar.style.opacity = '1';
        bar.style.width = '35%';

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          if (bar) bar.style.width = '75%';
        }, 200);
      }
    };

    document.addEventListener('click', handleDocumentClick, { passive: true });
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-[2.5px] bg-transparent"
      aria-hidden="true"
    >
      <div
        ref={barRef}
        className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-400 dark:from-emerald-400 dark:via-zinc-200 dark:to-white transition-all ease-out duration-200 shadow-[0_0_8px_rgba(52,211,153,0.6)] opacity-0 w-0"
      />
    </div>
  );
}
