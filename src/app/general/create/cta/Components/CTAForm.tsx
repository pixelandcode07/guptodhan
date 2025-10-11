'use client';

import { useState } from 'react';
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

type CTAFormProps = {
  initialData: any;
};

export default function CTAForm({ initialData }: CTAFormProps) {
  const [title, setTitle] = useState(initialData?.ctaTitle || '');
  const [btnText, setBtnText] = useState(initialData?.ctaButtonText || '');
  const [btnLink, setBtnLink] = useState(initialData?.ctaLink || '');
  const [status, setStatus] = useState(initialData?.isActive ? '1' : '0');
  const [content, setContent] = useState(initialData?.ctaDescription || '');
  const [preview, setPreview] = useState(initialData?.ctaImage || '');
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  const handleUploadChange = (_name: string, file: File | null) => {
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(initialData?.ctaImage || '');
    }
  };

  const handleCancel = () => {
    setTitle(initialData?.ctaTitle || '');
    setBtnText(initialData?.ctaButtonText || '');
    setBtnLink(initialData?.ctaLink || '');
    setStatus(initialData?.isActive ? '1' : '0');
    setContent(initialData?.ctaDescription || '');
    setPreview(initialData?.ctaImage || '');
  };

  const handleDone = async () => {
    if (!initialData?._id) {
      toast.error('CTA ID is missing.');
      return;
    }

    setLoading(true);

    const payload = {
      ctaImage: preview,
      ctaTitle: title,
      ctaButtonText: btnText,
      ctaLink: btnLink,
      ctaDescription: content,
      isActive: status === '1',
    };

    try {
      const res = await axios.patch(
        `http://localhost:3000/api/v1/about/cta/${initialData._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.success) {
        toast.success('CTA updated successfully!');
      } else {
        toast.error('Failed to update CTA!');
      }
    } catch (error: any) {
      console.error(error);
      toast.error('Error updating CTA!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-6 mt-4 gap-2">
      {/* Left Side */}
      <div className="col-span-2 space-y-4">
        <UploadImage
          label="CTA Image"
          name="ctaImage"
          preview={preview}
          onChange={handleUploadChange}
        />

        <div className="flex flex-col space-y-2">
          <Label htmlFor="btn_text">CTA Button Text</Label>
          <Input
            id="btn_text"
            type="text"
            value={btnText}
            onChange={e => setBtnText(e.target.value)}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="btn_link">CTA Button Link</Label>
          <Input
            id="btn_link"
            type="text"
            value={btnLink}
            onChange={e => setBtnLink(e.target.value)}
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="col-span-4 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">
            CTA Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <p className="text-xs font-semibold mb-2 mt-2">CTA Description</p>
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select One" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Active</SelectItem>
                <SelectItem value="0">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-start items-center w-full">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleDone} disabled={loading}>
              {loading ? 'Saving...' : 'Done'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
