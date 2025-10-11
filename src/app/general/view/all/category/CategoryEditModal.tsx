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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Featured</Label>
              <Select value={isFeatured} onValueChange={setIsFeatured}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Show On Navbar</Label>
              <Select value={isNavbar} onValueChange={setIsNavbar}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Icon</Label>
              <UploadImageBtn value={iconFile} onChange={setIconFile} />
            </div>
            <div className="space-y-2">
              <Label>Banner</Label>
              <UploadImageBtn value={bannerFile} onChange={setBannerFile} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={onSubmit}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


