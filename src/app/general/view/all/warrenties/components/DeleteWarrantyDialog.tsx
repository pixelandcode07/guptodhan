"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type DeleteWarrantyDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemName?: string
  isDeleting?: boolean
  onConfirm: () => void
}

export default function DeleteWarrantyDialog({ open, onOpenChange, itemName, isDeleting, onConfirm }: DeleteWarrantyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Warranty</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p>
            Are you sure you want to delete "{itemName}"? This action cannot be undone.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" disabled={!!isDeleting} onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            variant="destructive"
            disabled={!!isDeleting}
            onClick={onConfirm}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


