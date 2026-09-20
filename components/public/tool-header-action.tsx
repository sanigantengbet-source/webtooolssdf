'use client';

import React, { useState } from 'react';
import { Send, Check, ExternalLink } from 'lucide-react';

interface ToolHeaderActionProps {
  toolName: string;
  websiteUrl?: string | null;
  shortDescription?: string | null;
}

export function ToolHeaderAction({
  toolName,
  websiteUrl,
  shortDescription,
}: ToolHeaderActionProps) {
  const [copied, setCopied] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const handleShare = async () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareData = {
      title: `${toolName} - Tools Collection`,
      text: shortDescription || `Check out ${toolName} on Tools Collection`,
      url: currentUrl,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if ((error as Error)?.name === 'AbortError') {
          return;
        }
      }
    }

    // Fallback: Copy to clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setToastVisible(true);
        setTimeout(() => {
          setCopied(false);
          setToastVisible(false);
        }, 2000);
        return;
      } catch {
        // Fallback for older browsers
      }
    }

    // Document execCommand fallback
    try {
      const textarea = document.createElement('textarea');
      textarea.value = currentUrl;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setToastVisible(true);
      setTimeout(() => {
        setCopied(false);
        setToastVisible(false);
      }, 2000);
    } catch {
      // Ignored
    }
  };

  return (
    <div className="mt-5 sm:mt-6 flex items-center gap-3 w-full relative">
      {/* Pill Button: Open Website (replaces Follow) */}
      {websiteUrl ? (
        <a
          id="tool-primary-cta"
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 h-11 sm:h-12 px-6 rounded-full font-medium text-sm sm:text-base bg-[#171717] text-white dark:bg-[#ededed] dark:text-black hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <span>Open Website</span>
          <ExternalLink className="h-4 w-4 opacity-75" />
        </a>
      ) : (
        <div
          className="flex-1 h-11 sm:h-12 px-6 rounded-full font-medium text-sm sm:text-base bg-[#171717]/40 text-white/40 dark:bg-[#ededed]/40 dark:text-black/40 cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span>Open Website</span>
        </div>
      )}

      {/* Circular Button: Bagikan (Paper Plane / Share) */}
      <div className="relative shrink-0">
        <button
          type="button"
          id="tool-share-button"
          onClick={handleShare}
          aria-label="Bagikan tools"
          title="Bagikan tools"
          className="h-11 w-11 sm:h-12 sm:w-12 rounded-full border border-[#eaeaea] dark:border-[#27272a] bg-[#f4f4f5] dark:bg-[#222225] hover:bg-[#e4e4e7] dark:hover:bg-[#2c2c30] active:scale-95 text-[#171717] dark:text-[#ededed] flex items-center justify-center transition-all cursor-pointer shadow-sm group"
        >
          {copied ? (
            <Check className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 transition-transform scale-110" />
          ) : (
            <Send className="h-4 w-4 sm:h-5 sm:w-5 -rotate-12 translate-x-0.5 text-zinc-700 dark:text-zinc-300 group-hover:scale-105 transition-transform" />
          )}
        </button>

        {/* Floating tooltip feedback when link copied */}
        {toastVisible && (
          <div className="absolute -top-9 right-0 bg-[#171717] text-white dark:bg-[#ededed] dark:text-black text-[11px] font-medium px-2.5 py-1 rounded-full shadow-lg whitespace-nowrap pointer-events-none z-20">
            Link disalin!
          </div>
        )}
      </div>
    </div>
  );
}
