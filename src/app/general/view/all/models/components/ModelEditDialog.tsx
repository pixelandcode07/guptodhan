"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Model } from "@/components/TableHelper/model_columns";
import type { Session } from "next-auth";

interface ModelEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Model | null;
  onSave: () => void;
  session: Session | null;
}

export default function ModelEditDialog({
  open,
  onOpenChange,
  editing,
  onSave,
  session,
}: ModelEditDialogProps) {
  type AugmentedSession = Session & { accessToken?: string; user?: Session["user"] & { role?: string } }
  const s = session as AugmentedSession | null
  const token = s?.accessToken
  const userRole = s?.user?.role

  const [editForm, setEditForm] = useState({
    modelName: "",
    modelCode: "",
    status: "Active" as "Active" | "Inactive",
  });

  // Update form when editing model changes
  useEffect(() => {
    if (editing) {
      setEditForm({
        modelName: editing.modelName,
        modelCode: editing.code,
        status: editing.status,
      });
    }
  }, [editing]);

  const handleSave = async () => {
    if (!editing) return;
    
    try {
      await axios.patch(`/api/v1/product-config/modelName/${editing._id}`, {
        modelName: editForm.modelName,
        modelCode: editForm.modelCode,
        status: editForm.status === "Active" ? "active" : "inactive",
        modelFormId: editForm.modelName.trim().toLowerCase().replace(/\s+/g, "-"),
      }, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { "x-user-role": userRole } : {}),
          "Content-Type": "application/json",
        }
      });
      
      toast.success("Model updated");
      onOpenChange(false);
      onSave();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-600">
            <div className="p-1 bg-blue-100 rounded">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            Edit Model
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Model Name</Label>
            <Input 
              value={editForm.modelName} 
              onChange={(e) => setEditForm({ ...editForm, modelName: e.target.value })}
              className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter model name"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Model Code</Label>
            <Input 
              value={editForm.modelCode} 
              onChange={(e) => setEditForm({ ...editForm, modelCode: e.target.value })}
              className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter model code"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Status</Label>
            <Select 
              value={editForm.status} 
              onValueChange={(v) => setEditForm({ ...editForm, status: v as typeof editForm.status })}
            >
              <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
