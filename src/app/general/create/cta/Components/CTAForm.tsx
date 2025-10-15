'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import RichTextEditor from '@/components/ReusableComponents/RichTextEditor';
import UploadImage from '@/components/ReusableComponents/UploadImage';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

type CTAFormProps = {
  initialData: any;
};

export default function CTAForm({ initialData }: CTAFormProps) {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  const [loading, setLoading] = useState(false);
  
  // State for form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [btnText, setBtnText] = useState('');
  const [btnLink, setBtnLink] = useState('');
  const [status, setStatus] = useState('active');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.ctaTitle || '');
      setDescription(initialData.ctaDescription || '');
      setBtnText(initialData.ctaButtonText || '');
      setBtnLink(initialData.ctaLink || '');
      setStatus(initialData.status || 'active');
      setImagePreview(initialData.ctaImage || null);
    }
  }, [initialData]);

  const handleImageChange = (_name: string, file: File | null) => {
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(initialData?.ctaImage || null);
    }
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return toast.error("Authentication failed. Please log in.");
    setLoading(true);

    const formData = new FormData();
    formData.append('ctaTitle', title);
    formData.append('ctaDescription', description);
    formData.append('ctaButtonText', btnText);
    formData.append('ctaLink', btnLink);
    formData.append('status', status);
    if (imageFile) {
      formData.append('ctaImage', imageFile);
    }

    try {
      const url = initialData?._id ? `/api/v1/about/cta/${initialData._id}` : '/api/v1/about/cta';
      const method = initialData?._id ? 'PATCH' : 'POST';

      const res = await axios({
        method,
        url,
        data: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        toast.success('CTA updated successfully!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update CTA.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <div className="lg:col-span-1 space-y-4">
        <UploadImage
          label="CTA Image (Recommended: 800x400px)"
          name="ctaImage"
          preview={imagePreview || undefined}
          onChange={handleImageChange}
        />
        <div className="space-y-2">
          <Label htmlFor="btn_text">Button Text</Label>
          <Input id="btn_text" value={btnText} onChange={e => setBtnText(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="btn_link">Button Link</Label>
          <Input id="btn_link" value={btnLink} onChange={e => setBtnLink(e.target.value)} />
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">CTA Title <span className="text-red-500">*</span></Label>
          <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>CTA Description</Label>
          <RichTextEditor value={description} onChange={setDescription} />
        </div>
        <div className="space-y-2 max-w-xs">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value)}>
                <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="flex justify-start items-center pt-4">
            <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                {loading ? 'Saving...' : 'Update CTA'}
            </Button>
        </div>
      </div>
    </form>
  );
}