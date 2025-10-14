"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Model } from "@/components/TableHelper/model_columns";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model: Model | null;
  onConfirm: () => void;
  loading?: boolean;
}

export default function DeleteConfirmationDialog({
  open,
  onOpenChange,
  model,
  onConfirm,
  loading = false,
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <div className="p-1 bg-red-100 rounded">
              <AlertTriangle className="w-5 h-5" />
            </div>
            Confirm Deletion
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to delete this model? This action cannot be undone.
          </p>
          
          {model && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 p-4 rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Model Name:</span>
                  <span className="text-sm font-semibold text-gray-900">{model.modelName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Model Code:</span>
                  <span className="text-sm font-semibold text-gray-900">{model.code}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Brand:</span>
                  <span className="text-sm font-semibold text-gray-900">{model.brand}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all duration-200"
          >
            {loading ? "Deleting..." : "Delete Model"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
