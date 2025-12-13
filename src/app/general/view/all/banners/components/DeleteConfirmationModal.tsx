'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  bannerTitle: string;
  isDeleting?: boolean;
}

export default function DeleteConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  bannerTitle,
  isDeleting = false
}: DeleteConfirmationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Delete Banner
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Are you sure you want to delete this banner? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-medium text-gray-900">Banner Title:</p>
          <p className="text-gray-700">{bannerTitle}</p>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete Banner'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
