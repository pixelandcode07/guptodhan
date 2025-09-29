"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Color } from "@/components/TableHelper/color_columns";

interface ColorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; code: string; status?: string }) => void;
  editing: Color | null;
  onClose: () => void;
}

export default function ColorModal({ open, onOpenChange, onSubmit, editing, onClose }: ColorModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    status: "Active",
  });

  useEffect(() => {
    if (editing) {
      setFormData({
        name: editing.name,
        code: editing.code,
        status: editing.status,
      });
    } else {
      setFormData({
        name: "",
        code: "",
        status: "Active",
      });
    }
  }, [editing, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      return;
    }
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({
      name: "",
      code: "",
      status: "Active",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Color" : "Add New Color"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Color Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter color name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="code">Color Code</Label>
            <div className="flex items-center gap-2">
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="#000000"
                required
                className="flex-1"
              />
              <div 
                className="w-10 h-10 rounded border border-gray-300"
                style={{ backgroundColor: formData.code || "#ffffff" }}
              />
            </div>
          </div>

          {editing && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              {editing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
