// src/components/ConfirmDialog.tsx
'use client';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export const confirmDelete = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    toast(
      <div className="flex flex-col gap-4 p-1">
        <p className="font-medium text-gray-800">{message}</p>
        <div className="flex gap-2 justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              toast.dismiss();
              resolve(false);
            }}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-red-600 hover:bg-red-700"
            onClick={() => {
              toast.dismiss();
              resolve(true);
            }}
          >
            Delete
          </Button>
        </div>
      </div>,
      {
        duration: Infinity,
        style: { background: 'white' },
      }
    );
  });
};