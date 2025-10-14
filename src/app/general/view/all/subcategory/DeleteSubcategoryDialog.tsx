"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteSubcategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name?: string;
  onConfirm: () => void;
  loading?: boolean;
}

export default function DeleteSubcategoryDialog({ open, onOpenChange, name, onConfirm, loading }: DeleteSubcategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Subcategory</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Are you sure you want to delete the subcategory {name}? This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={!!loading}>Cancel</Button>
            <Button variant="destructive" onClick={onConfirm} disabled={!!loading}>{loading ? "Deleting..." : "Delete"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


