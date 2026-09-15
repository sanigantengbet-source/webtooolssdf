'use client';

import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  resourceName: string;
  warningText?: string;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  resourceName,
  warningText,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Deletion failed');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-[#111111] border border-[#eaeaea] dark:border-[#27272a] rounded-lg shadow-xl p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="h-9 w-9 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#171717] dark:text-[#ededed]">
              {title}
            </h3>
            <p className="text-xs text-[#666666] dark:text-[#a1a1a1] mt-1 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-[#171717] dark:text-[#ededed] font-medium">
                &ldquo;{resourceName}&rdquo;
              </strong>
              ? This action cannot be undone.
            </p>
            {warningText && (
              <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-2">
                {warningText}
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded bg-red-500/10 border border-red-500/20 text-xs text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="px-3 py-1.5 text-xs rounded border border-[#eaeaea] dark:border-[#27272a] hover:bg-[#fafafa] dark:hover:bg-[#181818] text-[#171717] dark:text-[#ededed]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleConfirm}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>Delete Permanently</span>
          </button>
        </div>
      </div>
    </div>
  );
}
