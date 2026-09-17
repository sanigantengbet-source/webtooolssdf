import React from 'react';
import { Github, MessageCircle, Coffee } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#eaeaea] dark:border-[#27272a] py-6 text-xs text-[#666666] dark:text-[#a1a1a1] bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3">
          <p>© {new Date().getFullYear()} Tool Collection.</p>
          <span className="hidden sm:inline text-zinc-400 dark:text-zinc-600">•</span>
          <p className="font-semibold tracking-wider text-[#171717] dark:text-[#ededed] uppercase">
            POWERED BY SANN404 FORUM GROUP
          </p>
        </div>

        <div className="flex items-center flex-wrap justify-center gap-4 text-xs">
          <a
            href="https://whatsapp.com/channel/0029Vb6ukqnHQbS4mKP0j80L"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-[#171717] dark:hover:text-[#ededed] transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
            <span>Saluran</span>
          </a>

          <a
            href="https://github.com/sannnproject"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-[#171717] dark:hover:text-[#ededed] transition-colors"
          >
            <Github className="h-3.5 w-3.5" />
            <span>GitHub</span>
          </a>

          <a
            href="https://saweria.co/sannnforums"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-[#171717] dark:hover:text-[#ededed] transition-colors"
          >
            <Coffee className="h-3.5 w-3.5" />
            <span>buy me a coffee</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
