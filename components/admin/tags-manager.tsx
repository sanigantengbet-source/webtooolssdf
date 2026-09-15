'use client';

import React, { useState } from 'react';
import { Plus, Tag, Trash2, Edit2, Loader2, AlertCircle, X } from 'lucide-react';
import { DeleteConfirmModal } from './delete-confirm-modal';
import type { Tag as TagType } from '@/lib/types';

interface TagsManagerProps {
  initialTags: TagType[];
}

export function TagsManager({ initialTags }: TagsManagerProps) {
  const [tags, setTags] = useState<TagType[]>(initialTags);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tagToEdit, setTagToEdit] = useState<TagType | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<TagType | null>(null);

  const openCreateModal = () => {
    setTagToEdit(null);
    setName('');
    setSlug('');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (t: TagType) => {
    setTagToEdit(t);
    setName(t.name);
    setSlug(t.slug);
    setError(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!tagToEdit) {
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
      setError('Tag name is required.');
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
    };

    try {
      const url = tagToEdit ? `/api/admin/tags/${tagToEdit.id}` : '/api/admin/tags';
      const method = tagToEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to save tag.');
        setIsSaving(false);
        return;
      }

      if (tagToEdit) {
        setTags((prev) =>
          prev.map((t) => (t.id === tagToEdit.id ? { ...t, ...payload } : t))
        );
      } else {
        setTags((prev) => [...prev, data.tag]);
      }

      setIsModalOpen(false);
    } catch {
      setError('Network error while saving tag.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTag = async () => {
    if (!tagToDelete) return;
    const res = await fetch(`/api/admin/tags/${tagToDelete.id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to delete tag');
    }
    setTags((prev) => prev.filter((t) => t.id !== tagToDelete.id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#eaeaea] dark:border-[#27272a]">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#171717] dark:text-[#ededed]">
            Tags
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] dark:text-[#a1a1a1] mt-1">
            Manage technology and classification tags used across your collection
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-medium bg-[#171717] text-white dark:bg-[#ededed] dark:text-black hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Tag</span>
        </button>
      </div>

      {/* Tags Flow */}
      <div className="rounded-lg border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#111111] p-5">
        <div className="flex flex-wrap gap-2.5">
          {tags.map((t) => (
            <div
              key={t.id}
              className="inline-flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-md border border-[#eaeaea] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#161616] text-xs font-mono group"
            >
              <Tag className="h-3 w-3 text-zinc-500" />
              <span className="text-[#171717] dark:text-[#ededed]">{t.name}</span>
              <span className="text-[10px] text-zinc-400">/{t.slug}</span>

              <div className="flex items-center ml-1 border-l border-zinc-200 dark:border-zinc-800 pl-1">
                <button
                  onClick={() => openEditModal(t)}
                  className="p-1 text-zinc-400 hover:text-black dark:hover:text-white rounded"
                  title="Edit tag"
                >
                  <Edit2 className="h-3 w-3" />
                </button>
                <button
                  onClick={() => {
                    setTagToDelete(t);
                    setDeleteModalOpen(true);
                  }}
                  className="p-1 text-red-500 hover:text-red-700 rounded"
                  title="Delete tag"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}

          {tags.length === 0 && (
            <div className="py-8 text-center w-full text-xs text-[#666666] dark:text-[#a1a1a1]">
              No tags created yet.
            </div>
          )}
        </div>
      </div>

      {/* Tag Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-[#111111] border border-[#eaeaea] dark:border-[#27272a] rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#eaeaea] dark:border-[#27272a] mb-4">
              <h2 className="text-sm font-semibold text-[#171717] dark:text-[#ededed]">
                {tagToEdit ? 'Edit Tag' : 'New Tag'}
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
                <label className="block text-xs font-medium mb-1">Tag Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="TypeScript"
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
                  placeholder="typescript"
                  className="w-full px-3 py-2 text-xs font-mono rounded border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#181818] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
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
                  <span>{tagToEdit ? 'Save Tag' : 'Create Tag'}</span>
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
        onConfirm={handleDeleteTag}
        title="Delete Tag"
        resourceName={tagToDelete?.name || ''}
        warningText="The tag will be removed from all associated tools."
      />
    </div>
  );
}
