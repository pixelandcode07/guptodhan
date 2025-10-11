"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FeaturedConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isCurrentlyFeatured: boolean;
  onConfirm: () => void;
  loading?: boolean;
}

export default function FeaturedConfirmDialog({ open, onOpenChange, isCurrentlyFeatured, onConfirm, loading }: FeaturedConfirmDialogProps) {
  const title = "Toggle Featured Status";
  const actionLabel = isCurrentlyFeatured ? "Remove Featured" : "Set Featured";
  const prompt = isCurrentlyFeatured
    ? "Are you sure you want to remove this flag from featured?"
    : "Are you sure you want to set this flag as featured?";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{prompt}</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={!!loading}>
              Cancel
            </Button>
            <Button onClick={onConfirm} disabled={!!loading}>{loading ? "Saving..." : actionLabel}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


