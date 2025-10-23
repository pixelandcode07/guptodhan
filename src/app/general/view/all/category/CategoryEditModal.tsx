'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import UploadImage from '@/components/ReusableComponents/UploadImage';
import { Loader2 } from 'lucide-react';

type Category = {
  _id?: string;
  name: string;
  categoryIcon?: string;
  categoryBanner?: string;
  slug?: string;
  isFeatured?: boolean;
  isNavbar?: boolean;
  status?: 'Active' | 'Inactive';
};

export default function CategoryEditModal({
  open,
  onOpenChange,
  data,
  onSaved,
  onOptimisticUpdate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: Category | null;
  onSaved: () => void;
  onOptimisticUpdate?: (update: {
    _id: string;
    name: string;
    slug: string;
    status: 'Active' | 'Inactive';
    isFeatured: boolean;
    isNavbar: boolean;
  }) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isFeatured, setIsFeatured] = useState('no');
  const [isNavbar, setIsNavbar] = useState('no');
  const [status, setStatus] = useState('active');
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setNotFound(false);

      if (!data || !data._id) {
        // Data missing or invalid
        setNotFound(true);
        setLoading(false);
        return;
      }

      // Populate fields
      setName(data.name || '');
      setSlug(data.slug || '');
      setIsFeatured(data.isFeatured ? 'yes' : 'no');
      setIsNavbar(data.isNavbar ? 'yes' : 'no');
      setStatus((data.status || 'Active').toLowerCase());
      setIconFile(null);
      setBannerFile(null);
      setLoading(false);
    }
  }, [data, open]);

  const onSubmit = async () => {
    if (!data?._id) return; // Safety check
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('slug', slug);
      formData.append('status', status);
      formData.append('isFeatured', isFeatured === 'yes' ? 'true' : 'false');
      formData.append('isNavbar', isNavbar === 'yes' ? 'true' : 'false');
      if (iconFile) formData.append('categoryIcon', iconFile);
      if (bannerFile) formData.append('categoryBanner', bannerFile);

      const res = await fetch(
        `/api/v1/ecommerce-category/ecomCategory/${data._id}`,
        {
          method: 'PATCH',
          body: formData,
        }
      );

      const json = await res.json();
      if (!res.ok)
        throw new Error(json?.message || 'Failed to update category');

      onOptimisticUpdate?.({
        _id: data._id,
        name,
        slug,
        status: status === 'active' ? 'Active' : 'Inactive',
        isFeatured: isFeatured === 'yes',
        isNavbar: isNavbar === 'yes',
      });

      toast.success('Category updated');
      onOpenChange(false);
      onSaved();
    } catch (e: unknown) {
      const err = e as { message?: string };
      toast.error(err?.message || 'Failed to update category');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-gray-200">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            ) : (
              'Edit Category'
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        )}

        {/* Not Found */}
        {!loading && notFound && (
          <div className="p-4 text-center text-red-500">
            Category data is missing or not found.
          </div>
        )}

        {/* Form */}
        {!loading && !notFound && data && (
          <div className="space-y-4 sm:space-y-6 py-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={slug} onChange={e => setSlug(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Featured</Label>
                <Select value={isFeatured} onValueChange={setIsFeatured}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Show On Navbar</Label>
                <Select value={isNavbar} onValueChange={setIsNavbar}>
                  <SelectTrigger>
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
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Media Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UploadImage
                name="categoryIcon"
                label="Category Icon"
                preview={data?.categoryIcon}
                onChange={(_, file) => setIconFile(file)}
              />
              <UploadImage
                name="categoryBanner"
                label="Category Banner"
                preview={data?.categoryBanner}
                onChange={(_, file) => setBannerFile(file)}
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button
                onClick={onSubmit}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
