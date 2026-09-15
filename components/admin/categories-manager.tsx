'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Layers, Loader2, AlertCircle, X } from 'lucide-react';
import { DeleteConfirmModal } from './delete-confirm-modal';
import type { Category } from '@/lib/types';

interface CategoriesManagerProps {
  initialCategories: Category[];
}

export function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const openCreateModal = () => {
    setCategoryToEdit(null);
    setName('');
    setSlug('');
    setDescription('');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setCategoryToEdit(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setError(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!categoryToEdit) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }
    if (!slug.trim()) {
      setError('Slug is required.');
      return;
    }

    setIsSaving(true);
    setError(null);

    const payload = {
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      description: description.trim() || undefined,
    };

    try {
      const url = categoryToEdit
        ? `/api/admin/categories/${categoryToEdit.id}`
        : '/api/admin/categories';
      const method = categoryToEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to save category.');
        setIsSaving(false);
        return;
      }

      if (categoryToEdit) {
        setCategories((prev) =>
          prev.map((c) => (c.id === categoryToEdit.id ? { ...c, ...payload } : c))
        );
      } else {
        setCategories((prev) => [...prev, data.category]);
      }

      setIsModalOpen(false);
    } catch {
      setError('Network error while saving category.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    const res = await fetch(`/api/admin/categories/${categoryToDelete.id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to delete category');
    }
    setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eaeaea] dark:border-[#27272a]">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#171717] dark:text-[#ededed]">
            Categories
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] dark:text-[#a1a1a1] mt-1">
            Organize and classify tools for the public collection filters
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-medium bg-[#171717] text-white dark:bg-[#ededed] dark:text-black hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Grid/List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-4 rounded-lg border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    <Layers className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#171717] dark:text-[#ededed]">
                    {cat.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1 text-[#666666] dark:text-[#a1a1a1] hover:text-black dark:hover:text-white rounded"
                    title="Edit category"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setCategoryToDelete(cat);
                      setDeleteModalOpen(true);
                    }}
                    className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded"
                    title="Delete category"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="font-mono text-[11px] text-[#666666] dark:text-[#a1a1a1] mb-2">
                slug: {cat.slug}
              </div>

              <p className="text-xs text-[#666666] dark:text-[#a1a1a1] line-clamp-2">
                {cat.description || 'No description provided.'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-[#111111] border border-[#eaeaea] dark:border-[#27272a] rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#eaeaea] dark:border-[#27272a] mb-4">
              <h2 className="text-sm font-semibold text-[#171717] dark:text-[#ededed]">
                {categoryToEdit ? 'Edit Category' : 'New Category'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#666666] dark:text-[#a1a1a1] hover:text-black dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {error && (
                <div className="p-2.5 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Developer Tools"
                  className="w-full px-3 py-2 text-xs rounded border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#181818] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="developer-tools"
                  className="w-full px-3 py-2 text-xs font-mono rounded border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#181818] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Description (optional)</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description of this category..."
                  className="w-full px-3 py-2 text-xs rounded border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#181818] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eaeaea] dark:border-[#27272a]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs rounded border border-[#eaeaea] dark:border-[#27272a] text-[#171717] dark:text-[#ededed]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-[#171717] text-white dark:bg-[#ededed] dark:text-black hover:opacity-90 disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{categoryToEdit ? 'Save Changes' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        resourceName={categoryToDelete?.name || ''}
        warningText="Tools linked to this category will have this category detached without deleting the tools themselves."
      />
    </div>
  );
}
