"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FileUpload from "@/components/ReusableComponents/FileUpload";

interface FlagModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; icon: string; status?: string }) => void;
  editing?: {
    name: string;
    icon: string;
    status: string;
  } | null;
}

export default function FlagModal({ open, onOpenChange, onSubmit, editing }: FlagModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    status: "active",
  });

  useEffect(() => {
    if (editing) {
      setFormData({
        name: editing.name,
        icon: editing.icon,
        status: editing.status,
      });
    } else {
      setFormData({
        name: "",
        icon: "",
        status: "active",
      });
    }
  }, [editing, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleUploadComplete = (_name: string, url: string) => {
    setFormData(prev => ({ ...prev, icon: url }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Flag Info</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Flag Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter flag name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Flag Icon</Label>
            <FileUpload
              label="Upload flag icon"
              name="icon"
              preview={formData.icon || undefined}
              onUploadComplete={handleUploadComplete}
            />
          </div>

          {editing && (
            <div className="space-y-2">
              <Label htmlFor="status">Flag Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
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
            <Button type="submit">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
