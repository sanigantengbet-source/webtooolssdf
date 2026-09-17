'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, SlidersHorizontal, RefreshCw, X } from 'lucide-react';
import { ToolCard } from './tool-card';
import { CategoryFilters } from './category-filters';
import { getBrowserSupabase } from '@/lib/supabase/client';
import type { Tool, Category } from '@/lib/types';

interface PublicToolsViewProps {
  initialTools: Tool[];
  initialCategories: Category[];
  isConfigured: boolean;
}

export function PublicToolsView({
  initialTools,
  initialCategories,
  isConfigured,
}: PublicToolsViewProps) {
  const [tools, setTools] = useState<Tool[]>(initialTools);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch tools with current filters
  const fetchTools = useCallback(
    async (queryText: string, catSlug: string, status: string) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (queryText) params.set('q', queryText);
        if (catSlug && catSlug !== 'all') params.set('category', catSlug);
        if (status && status !== 'all') params.set('status', status);

        const res = await fetch(`/api/tools?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setTools(data.tools || []);
        }
      } catch (err) {
        console.error('Failed to fetch tools:', err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Handle search input with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchTools(query, selectedCategory, statusFilter);
    }, 120);
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    fetchTools(searchQuery, slug, statusFilter);
  };

  const handleStatusSelect = (status: string) => {
    setStatusFilter(status);
    fetchTools(searchQuery, selectedCategory, status);
  };

  // Setup Supabase Realtime Subscription for tools and categories
  useEffect(() => {
    const supabase = getBrowserSupabase();
    if (!supabase) return;

    // Create unique channel
    const channel = supabase
      .channel('public-tools-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tools' },
        () => {
          // Admin added, updated, or deleted tool: trigger refresh
          fetchTools(searchQuery, selectedCategory, statusFilter);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories' },
        async () => {
          // Refresh categories
          try {
            const catRes = await fetch('/api/categories');
            if (catRes.ok) {
              const catData = await catRes.json();
              setCategories(catData.categories || []);
            }
          } catch {
            // ignore
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTools, searchQuery, selectedCategory, statusFilter]);

  // Clean up debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6">
        {/* Full-width responsive search bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666] dark:text-[#a1a1a1]" />
          <input
            ref={searchInputRef}
            id="tool-search-input"
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search tools by name, description, tags, category..."
            className="w-full pl-9 pr-8 py-2 text-sm rounded-md border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#ededed] placeholder:text-[#666666] dark:placeholder:text-[#666666] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                fetchTools('', selectedCategory, statusFilter);
              }}
              type="button"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[#666666] dark:text-[#a1a1a1] hover:text-black dark:hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-[#666666] dark:text-[#a1a1a1]">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Status:</span>
          </div>
          <select
            id="status-filter-select"
            value={statusFilter}
            onChange={(e) => handleStatusSelect(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-md border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="coming_soon">Coming Soon</option>
          </select>

          <button
            onClick={() => fetchTools(searchQuery, selectedCategory, statusFilter)}
            type="button"
            className="p-1.5 rounded-md border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] text-[#666666] dark:text-[#a1a1a1] hover:text-[#171717] dark:hover:text-[#ededed]"
            title="Refresh list"
            aria-label="Refresh tools"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div id="categories" className="mb-6">
        <CategoryFilters
          categories={categories}
          selectedSlug={selectedCategory}
          onSelect={handleCategorySelect}
          totalToolsCount={tools.length}
        />
      </div>

      {/* Tools Grid or Loading Skeleton */}
      {isLoading && tools.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-48 rounded-lg border border-[#eaeaea] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#141414] animate-pulse p-5"
            />
          ))}
        </div>
      ) : tools.length > 0 ? (
        /* Responsive Grid: Desktop 3-4 col, Tablet 2 col, Mobile 1 col */
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 transition-opacity duration-150 ${isLoading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#eaeaea] dark:border-[#27272a] py-16 px-4 text-center">
          <p className="text-base font-medium text-[#171717] dark:text-[#ededed] mb-1">
            No tools available yet.
          </p>
          <p className="text-xs text-[#666666] dark:text-[#a1a1a1] max-w-sm">
            {searchQuery || selectedCategory !== 'all'
              ? 'Try adjusting your search query or category filter.'
              : isConfigured
              ? 'Use the Admin dashboard to add your first project or tool.'
              : 'Configure your Supabase database in .env.local to manage your tools.'}
          </p>
        </div>
      )}
    </div>
  );
}
