// src/app/(admin)/general/create/cta/Components/CTAForm.tsx
'use client';

import { useState, useEffect } from 'react';
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
  const [ctaData, setCtaData] = useState<any>(initialData);
  const [loading, setLoading] = useState(false);
  const [formReady, setFormReady] = useState(false);

  const [title, setTitle] = useState('');
  const [btnText, setBtnText] = useState('');
  const [btnLink, setBtnLink] = useState('');
  const [status, setStatus] = useState('1');
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  useEffect(() => {
    if (ctaData) {
      setTitle(ctaData.ctaTitle || '');
      setBtnText(ctaData.ctaButtonText || '');
      setBtnLink(ctaData.ctaLink || '');
      setStatus(ctaData.isActive ? '1' : '0');
      setContent(ctaData.ctaDescription || '');
      setPreview(ctaData.ctaImage || '');
    }
    setFormReady(true);
  }, [ctaData]);

  const handleUploadChange = (_name: string, file: File | null) => {
    setSelectedFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(ctaData?.ctaImage || '');
    }
  };

  const handleCancel = () => {
    if (!ctaData) return;
    setTitle(ctaData.ctaTitle || '');
    setBtnText(ctaData.ctaButtonText || '');
    setBtnLink(ctaData.ctaLink || '');
    setStatus(ctaData.isActive ? '1' : '0');
    setContent(ctaData.ctaDescription || '');
    setPreview(ctaData.ctaImage || '');
    setSelectedFile(null);
  };

  const handleDone = async () => {
    if (!ctaData?._id) {
      toast.error('CTA ID is missing.');
      return;
    }

    if (!title || !btnText || !btnLink) {
      toast.error('Please fill all required fields.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      if (selectedFile) {
        console.log('📤 Appending new image file:', selectedFile);
        formData.append('ctaImage', selectedFile);
      }

      formData.append('ctaTitle', title);
      formData.append('ctaButtonText', btnText);
      formData.append('ctaLink', btnLink);
      formData.append('ctaDescription', content);
      formData.append('isActive', status === '1' ? 'true' : 'false');

      console.log('🧾 FormData Entries:', Array.from(formData.entries()));

      const res = await axios.patch(
        `/api/v1/about/cta/${ctaData._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('🟢 Response from server:', res.data);

      if (res.data.success) {
        toast.success('CTA updated successfully!');

        // Use returned data first
        const updatedData = res.data.data;
        setCtaData(updatedData);
        if (updatedData.ctaImage) setPreview(updatedData.ctaImage);
        setSelectedFile(null);

        // Force refetch from public endpoint to guarantee DB sync
        try {
          const fresh = await axios.get('/api/v1/public/about/cta');
          if (fresh.data.success && fresh.data.data) {
            setCtaData(fresh.data.data);
            setPreview(fresh.data.data.ctaImage || updatedData.ctaImage || '');
          }
        } catch (err) {
          console.warn('Failed to fetch fresh CTA after update:', err);
        }
      } else {
        toast.error('Failed to update CTA!');
      }
    } catch (error) {
      console.error('❌ Error updating CTA:', error);
      toast.error('Error updating CTA!');
    } finally {
      setLoading(false);
    }
  };

  if (!formReady) {
    return (
      <p className="text-center mt-10 text-gray-500">Loading CTA data...</p>
    );
  }

  return (
    <div className="grid grid-cols-6 mt-4 gap-2">
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
