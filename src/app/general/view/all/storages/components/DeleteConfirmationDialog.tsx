"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { type Storage } from "@/components/TableHelper/storage_columns";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storage: Storage | null;
  onConfirm: () => void;
  loading: boolean;
}

export default function DeleteConfirmationDialog({
  open,
  onOpenChange,
  storage,
  onConfirm,
  loading,
}: DeleteConfirmationDialogProps) {
  if (!storage) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Confirm Deletion
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Are you sure you want to delete this storage type? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Storage Type:</span>
              <span className="text-sm text-gray-900">{storage.ram} / {storage.rom}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <span className={`text-sm font-semibold ${
                storage.status === "Active" ? "text-green-600" : "text-red-600"
              }`}>
                {storage.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">ID:</span>
              <span className="text-sm text-gray-600 font-mono">{storage._id}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
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
            {loading ? "Deleting..." : "Delete Storage Type"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
