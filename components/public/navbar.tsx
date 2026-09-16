'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Wrench, Search, Shield, Menu, X, Github, MessageCircle, Coffee } from 'lucide-react';

interface NavbarProps {
  onSearchClick?: () => void;
}

export function Navbar({ onSearchClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#eaeaea] dark:border-[#27272a] bg-white/80 dark:bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-semibold text-sm sm:text-base text-[#171717] dark:text-[#ededed] tracking-tight hover:opacity-85 transition-opacity"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded bg-[#171717] text-white dark:bg-[#ededed] dark:text-black">
              <Wrench className="h-4 w-4" />
            </div>
            <span>Tool Collection</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 text-xs text-[#666666] dark:text-[#a1a1a1]">
            <Link
              href="/"
              className="hover:text-[#171717] dark:hover:text-[#ededed] transition-colors"
            >
              Tools
            </Link>
            <Link
              href="/#categories"
              className="hover:text-[#171717] dark:hover:text-[#ededed] transition-colors"
            >
              Categories
            </Link>
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
              <span>give me coffe</span>
            </a>
          </nav>
        </div>

        {/* Right side: Search, Quick Socials, Theme Toggle, Admin link */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {onSearchClick && (
            <button
              onClick={onSearchClick}
              type="button"
              className="hidden sm:flex items-center gap-2 px-2.5 py-1 text-xs text-[#666666] dark:text-[#a1a1a1] bg-[#fafafa] dark:bg-[#141414] border border-[#eaeaea] dark:border-[#27272a] rounded-md hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
              title="Quick Search"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="font-mono text-[11px]">Search tools...</span>
              <kbd className="text-[10px] font-mono bg-white dark:bg-[#202020] px-1 py-0.5 rounded border border-[#eaeaea] dark:border-[#27272a]">
                /
              </kbd>
            </button>
          )}

          {/* Social quick action buttons (desktop) */}
          <a
            href="https://whatsapp.com/channel/0029Vb6ukqnHQbS4mKP0j80L"
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp Channel"
            aria-label="WhatsApp Channel"
            className="hidden sm:inline-flex items-center justify-center h-8 w-8 rounded-md border border-[#eaeaea] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#111111] text-[#171717] dark:text-[#ededed] hover:bg-[#eaeaea] dark:hover:bg-[#1a1a1a] transition-colors"
          >
            <MessageCircle className="h-4 w-4 text-emerald-500" />
          </a>

          <a
            href="https://github.com/sannnproject"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Profile"
            aria-label="GitHub Profile"
            className="hidden sm:inline-flex items-center justify-center h-8 w-8 rounded-md border border-[#eaeaea] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#111111] text-[#171717] dark:text-[#ededed] hover:bg-[#eaeaea] dark:hover:bg-[#1a1a1a] transition-colors"
          >
            <Github className="h-4 w-4" />
          </a>

          <Link
            href="/admin"
            id="admin-nav-link"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-[#eaeaea] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#111111] text-[#171717] dark:text-[#ededed] hover:bg-[#eaeaea] dark:hover:bg-[#1a1a1a] transition-colors"
          >
            <Shield className="h-3.5 w-3.5 text-zinc-500" />
            <span>Admin</span>
          </Link>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-md border border-[#eaeaea] dark:border-[#27272a] text-[#171717] dark:text-[#ededed]"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a] px-4 py-3 space-y-1.5">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#171717] dark:text-[#ededed] hover:text-black dark:hover:text-white"
          >
            Tools
          </Link>
          <Link
            href="/#categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#171717] dark:text-[#ededed] hover:text-black dark:hover:text-white"
          >
            Categories
          </Link>
          <a
            href="https://whatsapp.com/channel/0029Vb6ukqnHQbS4mKP0j80L"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-sm text-[#171717] dark:text-[#ededed] hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            <MessageCircle className="h-4 w-4 text-emerald-500" />
            <span>Saluran WhatsApp</span>
          </a>
          <a
            href="https://github.com/sannnproject"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-sm text-[#171717] dark:text-[#ededed] hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>
          <a
            href="https://saweria.co/sannnforums"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-sm text-[#171717] dark:text-[#ededed] hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            <Coffee className="h-4 w-4" />
            <span>give me coffe</span>
          </a>
          <div className="pt-2 border-t border-[#eaeaea] dark:border-[#27272a]">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-sm font-medium text-[#171717] dark:text-[#ededed]"
            >
              <Shield className="h-4 w-4 text-zinc-500" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
