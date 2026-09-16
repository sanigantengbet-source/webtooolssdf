'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Wrench,
  Layers,
  Tag,
  ShieldAlert,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User,
  AlertTriangle,
} from 'lucide-react';

interface AdminLayoutClientProps {
  children: React.ReactNode;
  username: string;
  mustChangePassword?: boolean;
}

export function AdminLayoutClient({
  children,
  username,
  mustChangePassword = false,
}: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Tools', href: '/admin/tools', icon: Wrench },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Tags', href: '/admin/tags', icon: Tag },
    { name: 'Audit Logs', href: '/admin/audit', icon: ShieldAlert },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#fafafa] dark:bg-black text-[#171717] dark:text-[#ededed]">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 h-14 border-b border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] sticky top-0 z-40">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <div className="h-6 w-6 rounded bg-[#171717] text-white dark:bg-[#ededed] dark:text-black flex items-center justify-center">
            <Wrench className="h-3.5 w-3.5" />
          </div>
          <span>Tool Admin</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="p-1.5 rounded-md border border-[#eaeaea] dark:border-[#27272a] text-[#171717] dark:text-[#ededed]"
            aria-label="Open navigation drawer"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Desktop Sidebar (Developer style thin clean border) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] shrink-0 sticky top-0 h-screen">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#eaeaea] dark:border-[#27272a] flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5 font-semibold text-sm">
            <div className="h-6 w-6 rounded bg-[#171717] text-white dark:bg-[#ededed] dark:text-black flex items-center justify-center">
              <Wrench className="h-3.5 w-3.5" />
            </div>
            <span>Tool Collection</span>
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#171717] text-white dark:bg-[#ededed] dark:text-black'
                    : 'text-[#666666] dark:text-[#a1a1a1] hover:text-[#171717] dark:hover:text-[#ededed] hover:bg-[#fafafa] dark:hover:bg-[#181818]'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer: User & Public Link & Logout */}
        <div className="p-3 border-t border-[#eaeaea] dark:border-[#27272a] space-y-2 text-xs">
          <div className="flex items-center gap-2 px-2 py-1.5 text-[#666666] dark:text-[#a1a1a1]">
            <User className="h-3.5 w-3.5" />
            <span className="truncate font-mono">{username}</span>
            <span className="ml-auto text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              Admin
            </span>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-1.5 rounded text-xs text-[#666666] dark:text-[#a1a1a1] hover:text-[#171717] dark:hover:text-[#ededed] hover:bg-[#fafafa] dark:hover:bg-[#181818] transition-colors"
          >
            <span>Public Site</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </aside>

      {/* Mobile Drawer (Accessible Sheet) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer panel */}
          <div className="relative flex flex-col w-72 max-w-[85vw] bg-white dark:bg-[#111111] border-r border-[#eaeaea] dark:border-[#27272a] p-4 h-full z-10">
            <div className="flex items-center justify-between pb-3 border-b border-[#eaeaea] dark:border-[#27272a] mb-4">
              <span className="font-semibold text-sm">Tool Collection Admin</span>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded text-zinc-500 hover:text-black dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium ${
                      isActive
                        ? 'bg-[#171717] text-white dark:bg-[#ededed] dark:text-black'
                        : 'text-[#666666] dark:text-[#a1a1a1]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-[#eaeaea] dark:border-[#27272a] space-y-2">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between text-xs py-2 text-[#666666] dark:text-[#a1a1a1]"
              >
                <span>View Public Site</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between text-xs py-2 text-red-600 dark:text-red-400"
              >
                <span>Sign Out</span>
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Force password change warning banner */}
        {mustChangePassword && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2.5 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                <strong>Security Action Required:</strong> You are using default admin credentials. You must change your password immediately in Settings.
              </span>
            </div>
            <Link
              href="/admin/settings"
              className="px-2.5 py-1 rounded bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors shrink-0"
            >
              Change Password
            </Link>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
