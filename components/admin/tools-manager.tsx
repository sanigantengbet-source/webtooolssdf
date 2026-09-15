'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  ExternalLink,
  Star,
  RefreshCw,
  Layers,
  Clock,
} from 'lucide-react';
import { ToolModal } from './tool-modal';
import { DeleteConfirmModal } from './delete-confirm-modal';
import type { Tool, Category, Tag } from '@/lib/types';

interface ToolsManagerProps {
  initialTools: Tool[];
  categories: Category[];
  tags: Tag[];
}

export function ToolsManager({
  initialTools,
  categories,
  tags,
}: ToolsManagerProps) {
  const [tools, setTools] = useState<Tool[]>(initialTools);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toolToEdit, setToolToEdit] = useState<Tool | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toolToDelete, setToolToDelete] = useState<Tool | null>(null);

  const fetchTools = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/tools');
      if (res.ok) {
        const data = await res.json();
        setTools(data.tools || []);
      }
    } catch (err) {
      console.error('Error fetching admin tools:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filter tools client-side for immediate responsive feel
  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      !searchQuery ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tool.short_description &&
        tool.short_description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'all' ||
      (tool.categories && tool.categories.some((c) => c.slug === categoryFilter));

    const matchesStatus = statusFilter === 'all' || tool.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleToggleFeatured = async (tool: Tool) => {
    try {
      const res = await fetch(`/api/admin/tools/${tool.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: tool.name,
          slug: tool.slug,
          description: tool.description,
          isFeatured: !tool.is_featured,
        }),
      });
      if (res.ok) {
        setTools((prev) =>
          prev.map((t) =>
            t.id === tool.id ? { ...t, is_featured: !t.is_featured } : t
          )
        );
      }
    } catch (err) {
      console.error('Failed to toggle featured status:', err);
    }
  };

  const handleDeleteTool = async () => {
    if (!toolToDelete) return;
    const res = await fetch(`/api/admin/tools/${toolToDelete.id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to delete tool');
    }
    setTools((prev) => prev.filter((t) => t.id !== toolToDelete.id));
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eaeaea] dark:border-[#27272a]">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#171717] dark:text-[#ededed]">
            Tools Catalog
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] dark:text-[#a1a1a1] mt-1">
            Manage, publish, categorize, and feature your projects and tools
          </p>
        </div>

        <button
          id="add-tool-btn"
          onClick={() => {
            setToolToEdit(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-medium bg-[#171717] text-white dark:bg-[#ededed] dark:text-black hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Tool</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#666666] dark:text-[#a1a1a1]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools by name, slug, description..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#ededed] placeholder:text-[#666666] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-[#666666] dark:text-[#a1a1a1]">
            <SlidersHorizontal className="h-3 w-3" />
            <span>Category:</span>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="coming_soon">Coming Soon</option>
            <option value="archived">Archived</option>
          </select>

          <button
            onClick={fetchTools}
            className="p-1.5 rounded border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] text-[#666666] dark:text-[#a1a1a1] hover:text-black dark:hover:text-white"
            title="Refresh list"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tools Table */}
      <div className="rounded-lg border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#eaeaea] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#161616] text-[#666666] dark:text-[#a1a1a1]">
              <tr>
                <th className="py-3 px-4 font-medium">Tool</th>
                <th className="py-3 px-4 font-medium">Categories & Tags</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Featured</th>
                <th className="py-3 px-4 font-medium">Updated</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaeaea] dark:divide-[#27272a]">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool) => {
                  const updatedDate = new Date(tool.updated_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });

                  const statusBadgeColors = {
                    active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
                    maintenance: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
                    coming_soon: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
                    archived: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20',
                  }[tool.status] || 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20';

                  return (
                    <tr
                      key={tool.id}
                      className="hover:bg-[#fafafa] dark:hover:bg-[#141414] transition-colors"
                    >
                      {/* Name & Logo */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded border border-[#eaeaea] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#181818] flex items-center justify-center shrink-0 overflow-hidden">
                            {tool.logo_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={tool.logo_url}
                                alt={tool.name}
                                className="h-full w-full object-contain p-0.5"
                              />
                            ) : (
                              <span className="font-semibold text-xs">
                                {tool.name.slice(0, 2).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-[#171717] dark:text-[#ededed] flex items-center gap-1.5">
                              <span>{tool.name}</span>
                              {tool.website_url && (
                                <a
                                  href={tool.website_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#666666] dark:text-[#a1a1a1] hover:text-black dark:hover:text-white"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                            <span className="text-[11px] font-mono text-[#666666] dark:text-[#a1a1a1]">
                              /{tool.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Categories & Tags */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(tool.categories || []).map((c) => (
                            <span
                              key={c.id}
                              className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                            >
                              {c.name}
                            </span>
                          ))}
                          {(tool.tags || []).slice(0, 2).map((t) => (
                            <span
                              key={t.id}
                              className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500"
                            >
                              #{t.name}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium border ${statusBadgeColors}`}
                        >
                          {tool.status}
                        </span>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleFeatured(tool)}
                          className={`p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
                            tool.is_featured
                              ? 'text-amber-500'
                              : 'text-zinc-400 hover:text-zinc-600'
                          }`}
                          title={tool.is_featured ? 'Featured tool' : 'Not featured'}
                        >
                          <Star
                            className={`h-4 w-4 ${
                              tool.is_featured ? 'fill-amber-500' : ''
                            }`}
                          />
                        </button>
                      </td>

                      {/* Updated Date */}
                      <td className="py-3 px-4 font-mono text-[11px] text-[#666666] dark:text-[#a1a1a1]">
                        {updatedDate}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Link
                            href={`/tools/${tool.slug}`}
                            target="_blank"
                            className="p-1 rounded text-[#666666] dark:text-[#a1a1a1] hover:text-black dark:hover:text-white"
                            title="View public page"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            onClick={() => {
                              setToolToEdit(tool);
                              setIsModalOpen(true);
                            }}
                            className="p-1 rounded text-[#666666] dark:text-[#a1a1a1] hover:text-black dark:hover:text-white"
                            title="Edit tool"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setToolToDelete(tool);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1 rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                            title="Delete tool"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-xs text-[#666666] dark:text-[#a1a1a1]"
                  >
                    No tools found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      <ToolModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchTools}
        toolToEdit={toolToEdit}
        categories={categories}
        tags={tags}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteTool}
        title="Delete Tool"
        resourceName={toolToDelete?.name || ''}
        warningText="All associations with categories and tags will be detached."
      />
    </div>
  );
}
