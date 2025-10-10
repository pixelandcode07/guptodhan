"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import UploadImage from "@/components/ReusableComponents/UploadImage";
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
  const [promoCodeId, setPromoCodeId] = useState("");
  const [title, setTitle] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [existingIcon, setExistingIcon] = useState("");
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
      setPromoCodeId(data._id || "");
      setTitle(data.title || "");
      setExistingIcon(data.icon || "");
      setIconFile(null);
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
      const formData = new FormData();
      formData.append('promoCodeId', promoCodeId);
      formData.append('title', title);
      formData.append('startDate', startDate);
      formData.append('endingDate', endingDate);
      formData.append('type', type);
      formData.append('value', value);
      formData.append('minimumOrderAmount', minimumOrderAmount || '0');
      formData.append('code', code);
      formData.append('shortDescription', shortDescription);
      formData.append('status', status);
      
      // Only append icon if a new file is selected, otherwise keep existing
      if (iconFile) {
        formData.append('icon', iconFile);
      } else if (existingIcon) {
        formData.append('icon', existingIcon);
      }

      const res = await fetch(`/api/v1/promo-code/${data._id}`, {
        method: 'PATCH',
        body: formData,
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
          icon: iconFile ? URL.createObjectURL(iconFile) : existingIcon,
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
              <Label className="text-sm font-medium text-gray-700">Promo Icon</Label>
              <div className="space-y-3">
                {/* Show existing icon if available */}
                {existingIcon && !iconFile && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                    <img 
                      src={existingIcon} 
                      alt="Current icon" 
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Current icon</p>
                    </div>
                  </div>
                )}
                
                {/* Upload new icon */}
                <UploadImage
                  name="promo_icon_edit"
                  onChange={(_name, file) => setIconFile(file)}
                />
                
                {/* Show preview of new icon */}
                {iconFile && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <img 
                      src={URL.createObjectURL(iconFile)} 
                      alt="New icon preview" 
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-blue-700">New icon selected</p>
                      <p className="text-xs text-blue-600">{iconFile.name}</p>
                    </div>
                  </div>
                )}
              </div>
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
