"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
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
  const [validationError, setValidationError] = useState<string | null>(null);

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
    
    // Validate color code format
    const colorCodeRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!colorCodeRegex.test(formData.code)) {
      setValidationError("Please enter a valid color code (e.g., #FF0000 or #F00)");
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
    setValidationError(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            {editing ? "Edit Color" : "Add New Color"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="name" className="text-sm sm:text-base font-medium">
              Color Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter color name"
              required
              className="h-11 sm:h-12 text-sm sm:text-base"
            />
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            <Label htmlFor="code" className="text-sm sm:text-base font-medium">
              Color Code
            </Label>
            <div className="flex items-center gap-2 sm:gap-3">
              <Input
                id="code"
                type="color"
                value={formData.code}
                onChange={(e) => {
                  setFormData({ ...formData, code: e.target.value });
                  if (validationError) setValidationError(null);
                }}
                className="w-12 h-10 sm:w-16 sm:h-12 p-1 border border-gray-300 rounded cursor-pointer flex-shrink-0"
              />
              <Input
                id="code-text"
                value={formData.code}
                onChange={(e) => {
                  setFormData({ ...formData, code: e.target.value });
                  if (validationError) setValidationError(null);
                }}
                placeholder="#000000"
                required
                className="flex-1 font-mono text-xs sm:text-sm h-10 sm:h-12"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Click the color picker or enter a hex code (e.g., #FF0000)
            </p>
            {validationError && (
              <div className="flex items-center gap-2 mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-xs text-red-600">{validationError}</p>
              </div>
            )}
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
