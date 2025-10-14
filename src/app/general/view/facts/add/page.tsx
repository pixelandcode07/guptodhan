'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import SectionTitle from '@/components/ui/SectionTitle';

export default function AddBlogPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [category, setCategory] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const payload = {
      blogId: formData.get('blogId'),
      coverImage: formData.get('coverImage'),
      category: category,
      title: formData.get('title'),
      description: formData.get('description'),
      tags: (formData.get('tags') as string)?.split(',').map(tag => tag.trim()),
      metaTitle: formData.get('metaTitle'),
      metaKeywords: (formData.get('metaKeywords') as string)
        ?.split(',')
        .map(k => k.trim()),
      metaDescription: formData.get('metaDescription'),
      status,
    };

    try {
      const res = await axios.post('/api/v1/blog', payload);
      if (res.data.success) {
        toast.success('Blog created successfully!');
        router.push('/admin/blogs');
      } else {
        toast.error('Failed to create blog!');
      }
    } catch (error: any) {
      console.error(error);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-md pt-6">
      <SectionTitle text="Create Blog" />

      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="blogId">Blog ID</Label>
            <Input
              id="blogId"
              name="blogId"
              placeholder="Unique blog ID"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input
              id="coverImage"
              name="coverImage"
              placeholder="https://..."
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" placeholder="Blog Title" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Blog Description"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" name="tags" placeholder="nextjs, react, mongodb" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category ID</Label>
            <Input
              id="category"
              name="category"
              placeholder="Paste category ObjectId"
              onChange={e => setCategory(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaTitle">Meta Title</Label>
          <Input
            id="metaTitle"
            name="metaTitle"
            placeholder="SEO title"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="metaKeywords">Meta Keywords</Label>
            <Input
              id="metaKeywords"
              name="metaKeywords"
              placeholder="keyword1, keyword2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              name="metaDescription"
              rows={2}
              placeholder="SEO description"
            />
          </div>
        </div>

        <div className="w-40 space-y-2">
          <Label>Status</Label>
          <Select
            value={status}
            onValueChange={val => setStatus(val as 'active' | 'inactive')}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? 'Saving...' : 'Save Blog'}
          </Button>
        </div>
      </form>
    </div>
  );
}
