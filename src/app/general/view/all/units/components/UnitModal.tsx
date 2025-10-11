"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Unit } from "@/components/TableHelper/unit_columns";

interface UnitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; status?: string }) => void;
  editing: Unit | null;
  onClose: () => void;
}

export default function UnitModal({ open, onOpenChange, onSubmit, editing, onClose }: UnitModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    status: "Active",
  });

  useEffect(() => {
    if (editing) {
      setFormData({
        name: editing.name,
        status: editing.status,
      });
    } else {
      setFormData({
        name: "",
        status: "Active",
      });
    }
  }, [editing, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      return;
    }
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({
      name: "",
      status: "Active",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            {editing ? "Edit Unit" : "Add New Unit"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="name" className="text-sm sm:text-base font-medium">
              Unit Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Kilogram, Liter, Piece"
              required
              className="h-11 sm:h-12 text-sm sm:text-base"
            />
          </div>

          {editing && (
            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="status" className="text-sm sm:text-base font-medium">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="h-11 sm:h-12 text-sm sm:text-base">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active" className="text-sm sm:text-base">Active</SelectItem>
                  <SelectItem value="Inactive" className="text-sm sm:text-base">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="w-full sm:w-auto h-11 sm:h-12 text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="w-full sm:w-auto h-11 sm:h-12 text-sm sm:text-base bg-green-600 hover:bg-green-700"
            >
              {editing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
