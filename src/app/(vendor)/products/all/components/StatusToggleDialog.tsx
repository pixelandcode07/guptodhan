'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  image: string;
  category: string;
  name: string;
  store: string;
  price: string;
  offer_price: string;
  stock: string;
  flag: string;
  status: "Active" | "Inactive";
  created_at: string;
}

interface StatusToggleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  isToggling: boolean;
  onConfirm: () => void;
}

export default function StatusToggleDialog({
  open,
  onOpenChange,
  product,
  isToggling,
  onConfirm
}: StatusToggleDialogProps) {
  const handleCancel = () => {
    onOpenChange(false);
  };

  const isActivating = product?.status === "Inactive";
  const actionText = isActivating ? "activate" : "deactivate";
  const buttonText = isActivating ? "Activate" : "Deactivate";
  const buttonColor = isActivating 
    ? "bg-green-600 hover:bg-green-700" 
    : "bg-red-600 hover:bg-red-700";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Status Change</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to {actionText} the product{' '}
            <span className="font-semibold">"{product?.name}"</span>?
          </p>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={isToggling}
            >
              Cancel
            </Button>
            <Button 
              onClick={onConfirm}
              disabled={isToggling}
              className={buttonColor}
            >
              {isToggling ? "Updating..." : buttonText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
