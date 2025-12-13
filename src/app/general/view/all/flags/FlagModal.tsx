"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UploadImage from "@/components/ReusableComponents/UploadImage";
import axios from "axios";
import { toast } from "sonner";

interface FlagModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; icon: string; status?: string }) => void;
  editing?: {
    name: string;
    icon: string;
    status: string;
  } | null;
  loading?: boolean;
}

export default function FlagModal({ open, onOpenChange, onSubmit, editing, loading }: FlagModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    status: "active",
  });
  const [uploading, setUploading] = useState(false);

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

  const handleImageChange = async (_name: string, file: File | null) => {
    if (!file) {
      // If file is removed, clear the icon
      setFormData(prev => ({ ...prev, icon: '' }));
      return;
    }

    // Upload file to Cloudinary
    setUploading(true);
    try {
      const formDataToUpload = new FormData();
      formDataToUpload.append('file', file);

      const response = await axios.post('/api/v1/image/upload', formDataToUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data?.secure_url) {
        setFormData(prev => ({ ...prev, icon: response.data.secure_url }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
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
            <UploadImage
              name="icon"
              label="Upload flag icon"
              preview={formData.icon || undefined}
              onChange={handleImageChange}
            />
            {uploading && (
              <p className="text-xs text-gray-500">Uploading image...</p>
            )}
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={!!loading || uploading}>
              Close
            </Button>
            <Button type="submit" disabled={!!loading || uploading}>
              {loading ? "Saving..." : uploading ? "Uploading..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
