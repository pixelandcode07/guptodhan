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

  const { register, handleSubmit, reset, watch, setValue } = useForm<OgFormInputs>();

  const ogImageFile = watch('ogImage');
  const existingOgImage = watch('existingOgImage');

  useEffect(() => {
    const fetchOgData = async () => {
      try {
        const res = await axios.get('/api/v1/public/seo-settings?page=homepage');
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
        toast.error("Could not load existing Open Graph data.");
      } finally {
        setLoading(false);
      }
    };
    fetchOgData();
  }, [reset]);

  const handleOgSubmit: SubmitHandler<OgFormInputs> = async (data) => {
    if (!token) return toast.error("Admin authentication failed.");

    // ✅ Frontend validation for file size
    if (data.ogImage && data.ogImage.length > 0) {
      const file = data.ogImage[0];
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`Image size must be less than 1MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
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
      formData.append('metaDescription', data.metaDescription || data.ogDescription);
      formData.append('metaKeywords', data.metaKeywords || '');
      
      if (data.ogImage && data.ogImage.length > 0) {
        formData.append('ogImage', data.ogImage[0]);
      }

      await axios.post('/api/v1/seo-settings', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
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
              {...register("ogTitle", { required: true })}
              placeholder="Enter Meta OG Title Here"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ogDescription">Meta OG Description</Label>
            <Textarea
              id="ogDescription"
              {...register("ogDescription", { required: true })}
              rows={5}
              placeholder="Write Meta OG Description Here"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ogImage">Meta OG Image</Label>
            <p className="text-xs text-muted-foreground">Maximum file size: 1MB</p>
            <Input
              type="file"
              id="ogImage"
              {...register("ogImage")}
              accept="image/*"
              className="cursor-pointer"
            />
            {(ogImageFile && ogImageFile.length > 0) || existingOgImage ? (
              <div className="mt-2">
                <img
                  src={ogImageFile && ogImageFile.length > 0 ? URL.createObjectURL(ogImageFile[0]) : existingOgImage}
                  alt="Current OG"
                  className="h-32 rounded border object-cover"
                />
              </div>
            ) : null}
          </div>

          <div className="flex justify-center space-x-4 pt-4">
            <Button type="button" variant="destructive">Cancel</Button>
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