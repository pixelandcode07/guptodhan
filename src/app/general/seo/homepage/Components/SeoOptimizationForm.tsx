'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import SectionTitle from '@/components/ui/SectionTitle';
import TagInput from './TagInput';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

interface SeoFormInputs {
  metaTitle: string;
  metaKeywords: string[];
  metaDescription: string;
}

export default function SeoOptimizationForm() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialKeywords, setInitialKeywords] = useState<string[]>([]); // ✅ State for keywords

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<SeoFormInputs>();

  useEffect(() => {
    const fetchSeoData = async () => {
      try {
        const res = await axios.get('/api/v1/public/seo-settings?page=homepage');
        if (res.data.success && res.data.data) {
          const keywords = res.data.data.metaKeywords || [];
          setInitialKeywords(keywords); // ✅ Set keywords state
          reset({
            metaTitle: res.data.data.metaTitle,
            metaKeywords: keywords,
            metaDescription: res.data.data.metaDescription,
          });
          setValue('metaKeywords', keywords); // ✅ Explicitly set value
        }
      } catch (error) {
        toast.error("Could not load existing SEO data.");
      } finally {
        setLoading(false);
      }
    };
    fetchSeoData();
  }, [reset, setValue]);

  const handleSeoSubmit: SubmitHandler<SeoFormInputs> = async (data) => {
    if (!token) return toast.error("Admin authentication failed.");
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('pageIdentifier', 'homepage');
      formData.append('metaTitle', data.metaTitle);
      formData.append('metaDescription', data.metaDescription);
      formData.append('metaKeywords', data.metaKeywords.join(','));
      formData.append('ogTitle', data.metaTitle);
      formData.append('ogDescription', data.metaDescription);

      await axios.post('/api/v1/seo-settings', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('SEO Info Updated Successfully!');
    } catch (err: any) {
      console.error('Error:', err.response?.data);
      toast.error(err.response?.data?.message || 'Update failed!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading SEO form...</div>;
  }

  return (
    <Card>
      <SectionTitle text="Search Engine Optimization for HomePage" />
      <CardContent>
        <form onSubmit={handleSubmit(handleSeoSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              {...register("metaTitle", { required: true })}
              placeholder="Enter Meta Title Here"
            />
          </div>

          <div className="space-y-2">
            <Label>Meta Keywords <small>(press Enter to add)</small></Label>
            <TagInput
              name="metaKeywords"
              initialTags={initialKeywords} // ✅ Pass state value
              onChange={(tags) => setValue('metaKeywords', tags)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              {...register("metaDescription", { required: true })}
              rows={5}
              placeholder="Write Meta Description Here"
            />
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