"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type PromoCode = {
  _id: string;
  id: number;
  title: string;
  effective_date: string;
  expiry_date: string;
  type: "Percentage" | "Fixed Amount";
  value: string;
  min_spend: string;
  code: string;
  status: "Active" | "Inactive" | "Expired";
  icon?: string;
  shortDescription?: string;
};

export default function PromoCodeEditModal({ 
  open, 
  onOpenChange, 
  data, 
  onSaved, 
  onOptimisticUpdate 
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: PromoCode | null;
  onSaved: () => void;
  onOptimisticUpdate?: (update: {
    _id: string;
    title: string;
    effective_date: string;
    expiry_date: string;
    type: "Percentage" | "Fixed Amount";
    value: string;
    min_spend: string;
    code: string;
    status: "Active" | "Inactive" | "Expired";
    icon?: string;
    shortDescription?: string;
  }) => void;
}) {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endingDate, setEndingDate] = useState("");
  const [type, setType] = useState<"Percentage" | "Fixed Amount">("Percentage");
  const [value, setValue] = useState("");
  const [minimumOrderAmount, setMinimumOrderAmount] = useState("");
  const [code, setCode] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setTitle(data.title || "");
      setIcon(data.icon || "");
      setStartDate(data.effective_date || "");
      setEndingDate(data.expiry_date || "");
      setType(data.type || "Percentage");
      setValue(data.value?.replace(/[^0-9.]/g, '') || "");
      setMinimumOrderAmount(data.min_spend || "");
      setCode(data.code || "");
      setShortDescription(data.shortDescription || "");
      setStatus(data.status?.toLowerCase() || "active");
    }
  }, [data, open]);

  const onSubmit = async () => {
    if (!data?._id) return;
    
    setLoading(true);
    try {
      const payload = {
        title,
        icon,
        startDate,
        endingDate,
        type,
        value: Number(value),
        minimumOrderAmount: Number(minimumOrderAmount),
        code,
        shortDescription,
        status,
      };

      const res = await fetch(`/api/v1/promo-code/${data._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.message || 'Failed to update promo code');
      }

      toast.success("Promo code updated successfully!");

      // Optimistic update
      if (onOptimisticUpdate) {
        onOptimisticUpdate({
          _id: data._id,
          title,
          effective_date: startDate,
          expiry_date: endingDate,
          type,
          value: type === "Percentage" ? `${value}%` : value,
          min_spend: minimumOrderAmount,
          code,
          status: status === "active" ? "Active" : "Inactive",
          icon,
          shortDescription,
        });
      }

      onOpenChange(false);
      onSaved();
    } catch (e: unknown) {
      const err = e as { message?: string };
      toast.error(err?.message || "Failed to update promo code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-gray-200">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            Edit Promo Code
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6 py-4">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-3">
              <h3 className="text-sm sm:text-base font-medium text-gray-900">Basic Information</h3>
              <p className="text-xs text-gray-600">Update the essential details</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Title</Label>
                <Input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-10 sm:h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter promo code title"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Code</Label>
                <Input 
                  value={code} 
                  onChange={(e) => setCode(e.target.value)}
                  className="h-10 sm:h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter promo code"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Icon URL</Label>
              <Input 
                value={icon} 
                onChange={(e) => setIcon(e.target.value)}
                className="h-10 sm:h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://example.com/icon.png"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Short Description</Label>
              <Textarea 
                value={shortDescription} 
                onChange={(e) => setShortDescription(e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter short description"
                rows={3}
              />
            </div>
          </div>

          {/* Date and Type Section */}
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-3">
              <h3 className="text-sm sm:text-base font-medium text-gray-900">Date and Type</h3>
              <p className="text-xs text-gray-600">Set validity period and discount type</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Effective Date</Label>
                <Input 
                  type="date"
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-10 sm:h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Expiry Date</Label>
                <Input 
                  type="date"
                  value={endingDate} 
                  onChange={(e) => setEndingDate(e.target.value)}
                  className="h-10 sm:h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Type</Label>
                <Select value={type} onValueChange={(value) => setType(value as "Percentage" | "Fixed Amount")}>
                  <SelectTrigger className="h-10 sm:h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Percentage">Percentage</SelectItem>
                    <SelectItem value="Fixed Amount">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Value</Label>
                <Input 
                  type="number"
                  value={value} 
                  onChange={(e) => setValue(e.target.value)}
                  className="h-10 sm:h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter discount value"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Minimum Order Amount</Label>
              <Input 
                type="number"
                value={minimumOrderAmount} 
                onChange={(e) => setMinimumOrderAmount(e.target.value)}
                className="h-10 sm:h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter minimum order amount"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-10 sm:h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4 border-t border-gray-200">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={loading}
            className="w-full sm:w-auto h-10 sm:h-11"
          >
            Cancel
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={loading}
            className="w-full sm:w-auto h-10 sm:h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
