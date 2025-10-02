"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface StorageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { ram: string; rom: string; status?: string }) => void;
  editing?: { ram: string; rom: string; status: string } | null;
}

export default function StorageModal({ open, onOpenChange, onSubmit, editing }: StorageModalProps) {
  const [formData, setFormData] = useState({ ram: "", rom: "", status: "active" });

  useEffect(() => {
    if (editing) {
      setFormData({ ram: editing.ram, rom: editing.rom, status: editing.status });
    } else {
      setFormData({ ram: "", rom: "", status: "active" });
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
          <DialogTitle>{editing ? 'Edit Storage Type' : 'Add Storage Type'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="ram">RAM</Label>
              <Input id="ram" value={formData.ram} onChange={(e)=>setFormData(prev=>({ ...prev, ram: e.target.value }))} placeholder="e.g., 8 GB" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rom">ROM</Label>
              <Input id="rom" value={formData.rom} onChange={(e)=>setFormData(prev=>({ ...prev, rom: e.target.value }))} placeholder="e.g., 256 GB" required />
            </div>
          </div>

          {editing && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value)=>setFormData(prev=>({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


