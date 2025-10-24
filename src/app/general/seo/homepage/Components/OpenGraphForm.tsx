/* eslint-disable @next/next/no-img-element */
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import SectionTitle from '@/components/ui/SectionTitle';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

interface OgFormInputs {
  ogTitle: string;
  ogDescription: string;
  ogImage: FileList | null;
  existingOgImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

const MAX_FILE_SIZE = 1 * 1024 * 1024; // ✅ 1MB in bytes

export default function OpenGraphForm() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, watch, setValue } =
    useForm<OgFormInputs>();

  const ogImageFile = watch('ogImage');
  const existingOgImage = watch('existingOgImage');

  useEffect(() => {
    const fetchOgData = async () => {
      try {
        const res = await axios.get(
          '/api/v1/public/seo-settings?page=homepage'
        );
        if (res.data.success && res.data.data) {
          reset({
            ogTitle: res.data.data.ogTitle,
            ogDescription: res.data.data.ogDescription,
            existingOgImage: res.data.data.ogImage,
            metaTitle: res.data.data.metaTitle,
            metaDescription: res.data.data.metaDescription,
            metaKeywords: res.data.data.metaKeywords?.join(','),
          });
        }
      } catch (error) {
        toast.error('Could not load existing Open Graph data.');
      } finally {
        setLoading(false);
      }
    };
    fetchOgData();
  }, [reset]);

  const handleOgSubmit: SubmitHandler<OgFormInputs> = async data => {
    if (!token) return toast.error('Admin authentication failed.');

    // ✅ Frontend validation for file size
    if (data.ogImage && data.ogImage.length > 0) {
      const file = data.ogImage[0];
      if (file.size > MAX_FILE_SIZE) {
        toast.error(
          `Image size must be less than 1MB. Current size: ${(
            file.size /
            1024 /
            1024
          ).toFixed(2)}MB`
        );
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('pageIdentifier', 'homepage');
      formData.append('ogTitle', data.ogTitle);
      formData.append('ogDescription', data.ogDescription);
      formData.append('metaTitle', data.metaTitle || data.ogTitle);
      formData.append(
        'metaDescription',
        data.metaDescription || data.ogDescription
      );
      formData.append('metaKeywords', data.metaKeywords || '');

      if (data.ogImage && data.ogImage.length > 0) {
        formData.append('ogImage', data.ogImage[0]);
      }

      await axios.post('/api/v1/seo-settings', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Open Graph Info Updated Successfully!');
    } catch (err: any) {
      console.error('Error:', err.response?.data);
      toast.error(err.response?.data?.message || 'Update failed!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading Open Graph form...</div>;
  }

  return (
    <Card>
      <SectionTitle text="Meta Open Graph for HomePage" />
      <CardContent>
        <form onSubmit={handleSubmit(handleOgSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ogTitle">Meta OG Title</Label>
            <Input
              id="ogTitle"
              {...register('ogTitle', { required: true })}
              placeholder="Enter Meta OG Title Here"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ogDescription">Meta OG Description</Label>
            <Textarea
              id="ogDescription"
              {...register('ogDescription', { required: true })}
              rows={5}
              placeholder="Write Meta OG Description Here"
            />
          </div>

          <div className="w-full space-y-2">
            <Label htmlFor="ogImage">Meta OG Image</Label>
            <p className="text-xs text-muted-foreground">
              Maximum file size: 1MB
            </p>

            <label
              htmlFor="ogImage"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition h-48 overflow-hidden bg-gray-50">
              {(ogImageFile && ogImageFile.length > 0) || existingOgImage ? (
                <div className="relative w-full h-full">
                  <img
                    src={
                      ogImageFile && ogImageFile.length > 0
                        ? URL.createObjectURL(ogImageFile[0])
                        : existingOgImage
                    }
                    alt="Preview"
                    className="object-contain w-full h-full rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setValue('ogImage', null)}
                    className="absolute top-2 px-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition">
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-gray-400 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 16v-4m0 0V8m0 4h4m-4 0H8m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-gray-500">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG (max 1MB)</p>
                </div>
              )}
            </label>

            <input
              id="ogImage"
              type="file"
              accept="image/*"
              className="hidden"
              {...register('ogImage')}
            />
          </div>

          <div className="flex justify-center space-x-4 pt-4">
            <Button type="button" variant="destructive">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin mr-2" />}
              {isSubmitting ? 'Updating...' : 'Update Info'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
