"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DeviceConditionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string }) => void;
  editing?: { name: string } | null;
}

export default function DeviceConditionModal({ open, onOpenChange, onSubmit, editing }: DeviceConditionModalProps) {
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    if (editing) {
      setFormData({ name: editing.name });
    } else {
      setFormData({ name: "" });
    }
  }, [editing, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            {editing ? 'Edit Device Condition' : 'Add Device Condition'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="name" className="text-sm sm:text-base font-medium">
              Condition Name
            </Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} 
              placeholder="e.g., Brand New, Used, Refurbished" 
              required 
              className="h-11 sm:h-12 text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto h-11 sm:h-auto text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="w-full sm:w-auto h-11 sm:h-auto text-sm sm:text-base"
            >
              {editing ? 'Update' : 'Create'} Device Condition
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
