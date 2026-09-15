'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, Loader2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import type { Tool, Category, Tag } from '@/lib/types';

interface ToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  toolToEdit: Tool | null;
  categories: Category[];
  tags: Tag[];
}

function ToolFormContent({
  onClose,
  onSaved,
  toolToEdit,
  categories,
  tags,
}: Omit<ToolModalProps, 'isOpen'>) {
  const [name, setName] = useState(toolToEdit?.name || '');
  const [slug, setSlug] = useState(toolToEdit?.slug || '');
  const [shortDescription, setShortDescription] = useState(toolToEdit?.short_description || '');
  const [description, setDescription] = useState(toolToEdit?.description || '');
  const [logoUrl, setLogoUrl] = useState(toolToEdit?.logo_url || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(toolToEdit?.thumbnail_url || '');
  const [websiteUrl, setWebsiteUrl] = useState(toolToEdit?.website_url || '');
  const [githubUrl, setGithubUrl] = useState(toolToEdit?.github_url || '');
  const [documentationUrl, setDocumentationUrl] = useState(toolToEdit?.documentation_url || '');
  const [status, setStatus] = useState<'active' | 'maintenance' | 'coming_soon' | 'archived'>(
    toolToEdit?.status || 'active'
  );
  const [isFeatured, setIsFeatured] = useState(toolToEdit?.is_featured || false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    (toolToEdit?.categories || []).map((c) => c.id)
  );
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    (toolToEdit?.tags || []).map((t) => t.id)
  );

  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logoFileRef = useRef<HTMLInputElement>(null);
  const thumbFileRef = useRef<HTMLInputElement>(null);

  // Auto-generate slug from name if creating new
  const handleNameChange = (val: string) => {
    setName(val);
    if (!toolToEdit) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  };

  const handleFileUpload = async (
    file: File,
    folder: 'logos' | 'thumbnails',
    onSuccess: (url: string) => void,
    setLoading: (loading: boolean) => void
  ) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to upload asset.');
      } else {
        onSuccess(data.url);
      }
    } catch {
      setError('Network error during asset upload.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSaving(true);
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Nama tool wajib diisi.');
      setIsSaving(false);
      return;
    }

    const trimmedDesc = description.trim();
    if (!trimmedDesc) {
      setError('Deskripsi tool wajib diisi.');
      setIsSaving(false);
      return;
    }

    let trimmedWebUrl = websiteUrl.trim();
    if (!trimmedWebUrl) {
      setError('Link web wajib diisi (contoh: https://example.com).');
      setIsSaving(false);
      return;
    }

    // Auto-normalize website URL protocol if missing
    if (!trimmedWebUrl.startsWith('http://') && !trimmedWebUrl.startsWith('https://') && !trimmedWebUrl.startsWith('/')) {
      trimmedWebUrl = `https://${trimmedWebUrl}`;
    }

    // Auto-generate slug if empty
    const finalSlug =
      slug.trim().toLowerCase() ||
      trimmedName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') ||
      `tool-${Date.now()}`;

    // Normalize optional URLs
    let cleanGithubUrl = githubUrl.trim();
    if (cleanGithubUrl && !cleanGithubUrl.startsWith('http://') && !cleanGithubUrl.startsWith('https://') && !cleanGithubUrl.startsWith('/')) {
      cleanGithubUrl = `https://${cleanGithubUrl}`;
    }

    let cleanDocUrl = documentationUrl.trim();
    if (cleanDocUrl && !cleanDocUrl.startsWith('http://') && !cleanDocUrl.startsWith('https://') && !cleanDocUrl.startsWith('/')) {
      cleanDocUrl = `https://${cleanDocUrl}`;
    }

    const payload = {
      name: trimmedName,
      slug: finalSlug,
      description: trimmedDesc,
      short_description: shortDescription.trim() || trimmedDesc.slice(0, 160),
      website_url: trimmedWebUrl,
      github_url: cleanGithubUrl,
      documentation_url: cleanDocUrl,
      logo_url: logoUrl.trim(),
      thumbnail_url: thumbnailUrl.trim(),
      status: status || 'active',
      is_featured: Boolean(isFeatured),
      category_ids: selectedCategoryIds,
      tag_ids: selectedTagIds,
      // Compatibility aliases
      shortDescription: shortDescription.trim() || trimmedDesc.slice(0, 160),
      logoUrl: logoUrl.trim(),
      thumbnailUrl: thumbnailUrl.trim(),
      websiteUrl: trimmedWebUrl,
      githubUrl: cleanGithubUrl,
      documentationUrl: cleanDocUrl,
      isFeatured: Boolean(isFeatured),
      categoryIds: selectedCategoryIds,
      tagIds: selectedTagIds,
    };

    try {
      const url = toolToEdit
        ? `/api/admin/tools/${toolToEdit.id}`
        : '/api/admin/tools';
      const method = toolToEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        setError(data.error || data.message || 'Gagal menyimpan tool.');
        setIsSaving(false);
        return;
      }

      onSaved();
      onClose();
    } catch {
      setError('Terjadi kendala jaringan saat menyimpan tool.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl bg-white dark:bg-[#111111] border border-[#eaeaea] dark:border-[#27272a] rounded-lg shadow-xl my-8">
      {/* Modal Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaeaea] dark:border-[#27272a]">
        <div>
          <h2 className="text-base font-semibold text-[#171717] dark:text-[#ededed]">
            {toolToEdit ? 'Edit Tool' : 'Add New Tool'}
          </h2>
          <p className="text-[11px] text-[#666666] dark:text-[#a1a1a1] mt-0.5">
            Wajib diisi: <span className="font-medium text-black dark:text-white">Nama, Link Web, dan Deskripsi</span>. Field lainnya opsional.
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-[#666666] dark:text-[#a1a1a1] hover:text-black dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Modal Body */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
        {error && (
          <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-700 dark:text-red-400 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* SECTION 1: WAJIB DIISI */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-black dark:text-white">
              Field Wajib *
            </span>
            <span className="text-[10px] text-[#888888]">3 field wajib</span>
          </div>

          {/* Name & Website URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1 text-[#171717] dark:text-[#ededed]">
                Nama Tool <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Contoh: Canva, Figma, ChatGPT..."
                className="w-full px-3 py-2 text-xs rounded border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#181818] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 text-[#171717] dark:text-[#ededed]">
                Link Web <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com atau example.com"
                className="w-full px-3 py-2 text-xs rounded border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#181818] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
              />
            </div>
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-xs font-medium mb-1 text-[#171717] dark:text-[#ededed]">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi penjelasan mengenai tool ini, fungsi dan fitur utamanya..."
              className="w-full px-3 py-2 text-xs rounded border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#181818] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
            />
          </div>
        </div>

        {/* SECTION 2: OPSIONAL */}
        <div className="pt-2 border-t border-[#eaeaea] dark:border-[#27272a] space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#666666] dark:text-[#a1a1a1]">
              Informasi Tambahan (Opsional)
            </span>
            <span className="text-[10px] text-[#888888]">Bisa diisi atau dilewati</span>
          </div>

          {/* Slug & Short Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1 text-[#666666] dark:text-[#a1a1a1]">
                Slug <span className="text-[10px] font-normal">(Opsional - otomatis dari nama)</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="otomatis dibuat jika kosong"
                className="w-full px-3 py-2 text-xs rounded border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#181818] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 text-[#666666] dark:text-[#a1a1a1]">
                Short Description <span className="text-[10px] font-normal">(Opsional)</span>
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Ringkasan singkat satu kalimat (opsional)"
                className="w-full px-3 py-2 text-xs rounded border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#181818] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
              />
            </div>
          </div>

          {/* Status & Featured */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1 text-[#666666] dark:text-[#a1a1a1]">
                Status <span className="text-[10px] font-normal">(Opsional)</span>
              </label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as 'active' | 'maintenance' | 'coming_soon' | 'archived'
                  )
                }
                className="w-full px-3 py-2 text-xs rounded border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#181818] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
              >
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="coming_soon">Coming Soon</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer text-[#171717] dark:text-[#ededed]">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-zinc-300 text-black focus:ring-black"
                />
                <span>Featured Tool (pin di atas)</span>
              </label>
            </div>
          </div>

          {/* Asset Upload: Logo & Thumbnail */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Logo */}
            <div>
              <label className="block text-xs font-medium mb-1 text-[#666666] dark:text-[#a1a1a1]">
                Logo URL / Upload <span className="text-[10px] font-normal">(Opsional)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://... atau upload file"
                  className="flex-1 px-3 py-2 text-xs rounded border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#181818] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                />
                <input
                  ref={logoFileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file, 'logos', setLogoUrl, setIsUploadingLogo);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => logoFileRef.current?.click()}
                  disabled={isUploadingLogo}
                  className="px-2.5 py-2 rounded text-xs border border-[#eaeaea] dark:border-[#27272a] hover:bg-[#fafafa] dark:hover:bg-[#1f1f1f] text-[#666666] dark:text-[#a1a1a1] flex items-center gap-1"
                  title="Upload logo"
                >
                  {isUploadingLogo ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Upload className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              {logoUrl && (
                <div className="mt-2 flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoUrl}
                    alt="Logo preview"
                    className="h-7 w-7 object-contain rounded border border-[#eaeaea] dark:border-[#27272a] p-0.5 bg-white dark:bg-[#181818]"
                  />
                  <span className="text-[11px] text-[#666666] dark:text-[#a1a1a1]">
                    Logo terpasang
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-xs font-medium mb-1 text-[#666666] dark:text-[#a1a1a1]">
                Thumbnail URL / Upload <span className="text-[10px] font-normal">(Opsional)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://... atau upload file"
                  className="flex-1 px-3 py-2 text-xs rounded border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#181818] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                />
                <input
                  ref={thumbFileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file, 'thumbnails', setThumbnailUrl, setIsUploadingThumb);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => thumbFileRef.current?.click()}
                  disabled={isUploadingThumb}
                  className="px-2.5 py-2 rounded text-xs border border-[#eaeaea] dark:border-[#27272a] hover:bg-[#fafafa] dark:hover:bg-[#1f1f1f] text-[#666666] dark:text-[#a1a1a1] flex items-center gap-1"
                  title="Upload thumbnail"
                >
                  {isUploadingThumb ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Upload className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              {thumbnailUrl && (
                <div className="mt-2 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-zinc-500" />
                  <span className="text-[11px] text-[#666666] dark:text-[#a1a1a1]">
                    Thumbnail terpasang
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* GitHub & Documentation URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1 text-[#666666] dark:text-[#a1a1a1]">
                GitHub URL <span className="text-[10px] font-normal">(Opsional)</span>
              </label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 text-xs rounded border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#181818] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 text-[#666666] dark:text-[#a1a1a1]">
                Documentation URL <span className="text-[10px] font-normal">(Opsional)</span>
              </label>
              <input
                type="text"
                value={documentationUrl}
                onChange={(e) => setDocumentationUrl(e.target.value)}
                placeholder="https://docs.example.com"
                className="w-full px-3 py-2 text-xs rounded border border-[#eaeaea] dark:border-[#27272a] bg-white dark:bg-[#181818] text-[#171717] dark:text-[#ededed] focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
              />
            </div>
          </div>

          {/* Categories Multi-Select */}
          {categories.length > 0 && (
            <div>
              <label className="block text-xs font-medium mb-1.5 text-[#666666] dark:text-[#a1a1a1]">
                Categories <span className="text-[10px] font-normal">(Opsional)</span>
              </label>
              <div className="flex flex-wrap gap-1.5 p-2 rounded border border-[#eaeaea] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#181818] max-h-28 overflow-y-auto">
                {categories.map((cat) => {
                  const isSelected = selectedCategoryIds.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategoryIds((prev) =>
                          isSelected ? prev.filter((id) => id !== cat.id) : [...prev, cat.id]
                        );
                      }}
                      className={`px-2 py-1 rounded text-xs transition-colors ${
                        isSelected
                          ? 'bg-[#171717] text-white dark:bg-[#ededed] dark:text-black font-medium'
                          : 'bg-white dark:bg-[#202020] text-[#666666] dark:text-[#a1a1a1] border border-[#eaeaea] dark:border-[#27272a]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tags Multi-Select */}
          {tags.length > 0 && (
            <div>
              <label className="block text-xs font-medium mb-1.5 text-[#666666] dark:text-[#a1a1a1]">
                Tags <span className="text-[10px] font-normal">(Opsional)</span>
              </label>
              <div className="flex flex-wrap gap-1.5 p-2 rounded border border-[#eaeaea] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#181818] max-h-28 overflow-y-auto">
                {tags.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        setSelectedTagIds((prev) =>
                          isSelected ? prev.filter((id) => id !== tag.id) : [...prev, tag.id]
                        );
                      }}
                      className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                        isSelected
                          ? 'bg-[#171717] text-white dark:bg-[#ededed] dark:text-black font-medium'
                          : 'bg-white dark:bg-[#202020] text-[#666666] dark:text-[#a1a1a1] border border-[#eaeaea] dark:border-[#27272a]'
                      }`}
                    >
                      #{tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="pt-4 border-t border-[#eaeaea] dark:border-[#27272a] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs rounded border border-[#eaeaea] dark:border-[#27272a] hover:bg-[#fafafa] dark:hover:bg-[#181818] text-[#171717] dark:text-[#ededed]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded bg-[#171717] text-white dark:bg-[#ededed] dark:text-black hover:opacity-90 disabled:opacity-50"
          >
            {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{toolToEdit ? 'Update Tool' : 'Create Tool'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export function ToolModal({
  isOpen,
  onClose,
  onSaved,
  toolToEdit,
  categories,
  tags,
}: ToolModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <ToolFormContent
        key={toolToEdit ? toolToEdit.id : 'new'}
        onClose={onClose}
        onSaved={onSaved}
        toolToEdit={toolToEdit}
        categories={categories}
        tags={tags}
      />
    </div>
  );
}
