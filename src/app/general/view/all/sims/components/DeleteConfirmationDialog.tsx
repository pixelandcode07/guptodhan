"use client";

import React from "react";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  itemName?: string;
  loading?: boolean;
  onConfirm: () => void;
};

export default function DeleteConfirmationDialog({ open, onOpenChange, itemName, loading, onConfirm }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => !loading && onOpenChange(false)} />
      <div className="relative z-10 w-full max-w-sm rounded-lg bg-white p-5 shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Delete Confirmation</h3>
        <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete{itemName ? ` "${itemName}"` : ''}? This action cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-4 py-2 rounded border border-gray-300 text-gray-700"
            onClick={() => onOpenChange(false)}
            disabled={!!loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-60"
            onClick={onConfirm}
            disabled={!!loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
