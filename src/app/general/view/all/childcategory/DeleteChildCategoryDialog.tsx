"use client";

import { AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteChildCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name?: string;
  onConfirm: () => void;
  loading?: boolean;
}

export default function DeleteChildCategoryDialog({ open, onOpenChange, name, onConfirm, loading }: DeleteChildCategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Delete Child Category
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Are you sure you want to delete the child category <strong>"{name}"</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
