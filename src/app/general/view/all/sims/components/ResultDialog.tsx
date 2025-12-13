"use client";

import React from "react";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: string;
  description?: string;
  actionLabel?: string;
};

export default function ResultDialog({ open, onOpenChange, title = "Success", description, actionLabel = "OK" }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className="relative z-10 w-full max-w-sm rounded-lg bg-white p-5 shadow-lg">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {description ? <p className="text-sm text-gray-600 mb-4">{description}</p> : null}
        <div className="flex justify-end">
          <button
            type="button"
            className="px-4 py-2 rounded bg-blue-600 text-white"
            onClick={() => onOpenChange(false)}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
