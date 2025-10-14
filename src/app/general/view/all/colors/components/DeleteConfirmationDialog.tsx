"use client";

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
import { type Color } from "@/components/TableHelper/color_columns";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  color: Color | null;
  onConfirm: () => void;
  loading: boolean;
}

export default function DeleteConfirmationDialog({
  open,
  onOpenChange,
  color,
  onConfirm,
  loading,
}: DeleteConfirmationDialogProps) {
  if (!color) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">
                Delete Color
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base text-gray-600 mt-1">
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded border border-gray-300 flex-shrink-0"
                style={{ backgroundColor: color.code || "#ffffff" }}
              />
              <div>
                <p className="font-medium text-gray-900 text-sm sm:text-base">
                  {color.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 font-mono">
                  {color.code}
                </p>
              </div>
            </div>
            
            <div className="text-xs sm:text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Color ID:</span> {color.productColorId}</p>
              <p><span className="font-medium">Status:</span> 
                <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                  color.status === "Active" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {color.status}
                </span>
              </p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mt-4">
            Are you sure you want to delete this color? This will permanently remove it from the system.
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="w-full sm:w-auto h-11 sm:h-12 text-sm sm:text-base"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
            className="w-full sm:w-auto h-11 sm:h-12 text-sm sm:text-base"
          >
            {loading ? "Deleting..." : "Delete Color"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
