"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import UploadImageBtn from "@/components/ReusableComponents/UploadImageBtn";

type Category = {
  _id?: string;
  name: string;
  categoryIcon?: string;
  categoryBanner?: string;
  slug?: string;
  isFeatured?: boolean;
  isNavbar?: boolean;
  status: "Active" | "Inactive";
};

export default function CategoryEditModal({ open, onOpenChange, data, onSaved, onOptimisticUpdate }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: Category | null;
  onSaved: () => void;
  onOptimisticUpdate?: (update: { _id: string; name: string; slug: string; status: "Active" | "Inactive"; isFeatured: boolean; isNavbar: boolean }) => void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isFeatured, setIsFeatured] = useState("no");
  const [isNavbar, setIsNavbar] = useState("no");
  const [status, setStatus] = useState("active");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  useEffect(() => {
    if (data) {
      setName(data.name);
      setSlug(data.slug || "");
      setIsFeatured(data.isFeatured ? "yes" : "no");
      setIsNavbar(data.isNavbar ? "yes" : "no");
      setStatus((data.status || "Active").toLowerCase());
      setIconFile(null);
      setBannerFile(null);
    }
  }, [data, open]);

  const onSubmit = async () => {
    if (!data?._id) return;
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("status", status);
      formData.append("isFeatured", isFeatured === "yes" ? "true" : "false");
      formData.append("isNavbar", isNavbar === "yes" ? "true" : "false");
      if (iconFile) formData.append("categoryIcon", iconFile);
      if (bannerFile) formData.append("categoryBanner", bannerFile);

      const res = await fetch(`/api/v1/ecommerce-category/ecomCategory/${data._id}`, {
        method: "PATCH",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to update category");
      // Optimistic UI update in parent
      onOptimisticUpdate?.({
        _id: data._id,
        name,
        slug,
        status: status === "active" ? "Active" : "Inactive",
        isFeatured: isFeatured === "yes",
        isNavbar: isNavbar === "yes",
      });
      toast.success("Category updated");
      onOpenChange(false);
      onSaved();
    } catch (e: unknown) {
      const err = e as { message?: string };
      toast.error(err?.message || "Failed to update category");
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
            Edit Category
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
                <Label className="text-sm font-medium text-gray-700">Name</Label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 sm:h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter category name"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Slug</Label>
                <Input 
                  value={slug} 
                  onChange={(e) => setSlug(e.target.value)}
                  className="h-10 sm:h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter slug"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Featured</Label>
                <Select value={isFeatured} onValueChange={setIsFeatured}>
                  <SelectTrigger className="h-10 sm:h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Show On Navbar</Label>
                <Select value={isNavbar} onValueChange={setIsNavbar}>
                  <SelectTrigger className="h-10 sm:h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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

          {/* Media Upload Section */}
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-3">
              <h3 className="text-sm sm:text-base font-medium text-gray-900">Media Upload</h3>
              <p className="text-xs text-gray-600">Update the category icon and banner</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Icon</Label>
                <UploadImageBtn value={iconFile} onChange={setIconFile} />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Banner</Label>
                <UploadImageBtn value={bannerFile} onChange={setBannerFile} />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4 border-t border-gray-200">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto h-10 sm:h-11"
          >
            Cancel
          </Button>
          <Button 
            onClick={onSubmit}
            className="w-full sm:w-auto h-10 sm:h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


