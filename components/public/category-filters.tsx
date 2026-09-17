'use client';

import React from 'react';
import type { Category } from '@/lib/types';

interface CategoryFiltersProps {
  categories: Category[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
  totalToolsCount: number;
}

export function CategoryFilters({
  categories,
  selectedSlug,
  onSelect,
  totalToolsCount,
}: CategoryFiltersProps) {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max">
        <button
          id="cat-filter-all"
          onClick={() => onSelect('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-75 active:scale-95 ${
            selectedSlug === 'all'
              ? 'bg-[#171717] text-white dark:bg-[#ededed] dark:text-black shadow-xs'
              : 'bg-[#fafafa] dark:bg-[#181818] text-[#666666] dark:text-[#a1a1a1] hover:text-[#171717] dark:hover:text-[#ededed] border border-[#eaeaea] dark:border-[#27272a]'
          }`}
        >
          All
          <span className="ml-1.5 opacity-60 text-[11px] font-mono">
            {totalToolsCount}
          </span>
        </button>

        {categories.map((cat) => {
          const isSelected = selectedSlug === cat.slug;
          return (
            <button
              key={cat.id}
              id={`cat-filter-${cat.slug}`}
              onClick={() => onSelect(cat.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-75 active:scale-95 ${
                isSelected
                  ? 'bg-[#171717] text-white dark:bg-[#ededed] dark:text-black shadow-xs'
                  : 'bg-[#fafafa] dark:bg-[#181818] text-[#666666] dark:text-[#a1a1a1] hover:text-[#171717] dark:hover:text-[#ededed] border border-[#eaeaea] dark:border-[#27272a]'
              }`}
            >
              {cat.name}
              {typeof cat.tool_count === 'number' && cat.tool_count > 0 && (
                <span className="ml-1.5 opacity-60 text-[11px] font-mono">
                  {cat.tool_count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
