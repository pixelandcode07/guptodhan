"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface WarrantyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; status?: string }) => void;
  editing?: { name: string; status: string } | null;
}

export default function WarrantyModal({ open, onOpenChange, onSubmit, editing }: WarrantyModalProps) {
  const [formData, setFormData] = useState({ name: "", status: "Active" });

  useEffect(() => {
    if (editing) {
      setFormData({ name: editing.name, status: editing.status });
    } else {
      setFormData({ name: "", status: "Active" });
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
            {editing ? 'Edit Warranty Type' : 'Add Warranty Type'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="name" className="text-sm sm:text-base font-medium">
              Warranty Type Name
            </Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} 
              placeholder="e.g., 1 Year Replacement Warranty" 
              required 
              className="h-11 sm:h-12 text-sm sm:text-base"
            />
          </div>

          {editing && (
            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="status" className="text-sm sm:text-base font-medium">
                Status
              </Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="h-11 sm:h-12">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

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
              {editing ? 'Update' : 'Create'} Warranty Type
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
