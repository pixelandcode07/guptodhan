'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import SectionTitle from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BlogForm, {
  BlogData,
} from '@/app/general/add/new/blog/Components/BlogForm';
import BlogSeoForm, {
  SeoData,
} from '@/app/general/add/new/blog/Components/BlogSeoForm';
import TagsInput from '@/app/general/add/new/blog/Components/TagInput';

export default function EditBlogPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // get id from query
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [formData, setFormData] = useState<BlogData>({
    category: '',
    title: '',
    shortDescription: '',
    coverImageUrl: '',
  });
  const [seoData, setSeoData] = useState<SeoData>({
    metaTitle: '',
    metaKeywords: [],
    metaDescription: '',
  });

  // --- Fetch and filter blog using GET all
  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/v1/blog'); // only this works
        const blogs = res.data.data;

        const blog = blogs.find((b: any) => b._id === id);

        if (!blog) {
          toast.error('Blog not found!');
          router.push('/general/view/all/blogs');
          return;
        }
        console.log(blog);

        // fill form fields
        setFormData({
          category: blog.category || '',
          title: blog.title || '',
          shortDescription: blog.description || '', // map from description
          coverImageUrl: blog.coverImage || '', // map from coverImage
        });

        setContent(blog.content || ''); // default empty if undefined
        setTags(blog.tags || []);
        setSeoData({
          metaTitle: blog.metaTitle || '',
          metaKeywords: blog.metaKeywords || [],
          metaDescription: blog.metaDescription || '',
        });

        // fill content, tags, SEO
        setContent(blog.content || '');
        setTags(blog.tags || []);
        setSeoData({
          metaTitle: blog.metaTitle || '',
          metaKeywords: blog.metaKeywords || [],
          metaDescription: blog.metaDescription || '',
        });
      } catch (error) {
        console.error('Error fetching blog:', error);
        toast.error('Failed to load blog data.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, router]);

  // --- Update blog using PATCH
  const handleUpdate = async () => {
    try {
      setLoading(true);

      const updatedData = {
        _id: id, // backend requires _id
        ...formData,
        content,
        tags,
        seoData,
      };

      const res = await axios.patch('/api/v1/blog', updatedData);

      if (res.data.success) {
        toast.success('Blog updated successfully!');
        router.push('/general/view/all/blogs');
      } else {
        toast.error(res.data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update blog.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-gray-500 text-lg">Loading blog data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow space-y-6">
      <div className="flex w-full justify-between items-center flex-wrap">
        <SectionTitle text="Edit Blog" />
        <Button
          variant="default"
          size="sm"
          onClick={() => router.push('/general/view/all/blogs')}>
          Back to List
        </Button>
      </div>

      <BlogForm formData={formData} setFormData={setFormData} />

      <Card>
        <CardContent className="p-4 space-y-2">
          <label className="font-medium text-sm">Content</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write blog content here..."
            className="w-full h-[300px] border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </CardContent>
      </Card>

      <TagsInput tags={tags} setTags={setTags} />
      <BlogSeoForm seoData={seoData} setSeoData={setSeoData} />

      <div className="flex justify-end pt-4">
        <Button onClick={handleUpdate} disabled={loading} className="w-[200px]">
          {loading ? 'Updating...' : 'Update Blog'}
        </Button>
      </div>
    </div>
  );
}
