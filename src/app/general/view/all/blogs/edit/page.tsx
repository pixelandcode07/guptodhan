'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import SectionTitle from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/button';

import RichTextEditor from '@/components/ReusableComponents/RichTextEditor';
import BlogForm from '@/app/general/add/new/blog/Components/BlogForm';
import TagsInput from './Components/TagsInput';
import BlogSeoForm from './Components/BlogSeoForm';

export default function EditBlogPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [blogData, setBlogData] = useState<BlogData>({
    category: '',
    title: '',
    shortDescription: '',
    coverImageUrl: '',
  });
  const [tags, setTags] = useState<string[]>([]);
  const [seoData, setSeoData] = useState<SeoData>({
    metaTitle: '',
    metaKeywords: [],
    metaDescription: '',
  });
  const [content, setContent] = useState('');

  // --- Fetch blog data
  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/v1/blog');
        const blogs = res.data.data;
        const blog = blogs.find((b: any) => b._id === id);

        if (!blog) {
          toast.error('Blog not found!');
          router.push('/general/view/all/blogs');
          return;
        }

        // Parent state update
        setBlogData({
          category: blog.category || '',
          title: blog.title || '',
          shortDescription: blog.description || '',
          coverImageUrl: blog.coverImage || '',
        });

        setContent(blog.content || '');
        setTags(blog.tags || []);
        setSeoData({
          metaTitle: blog.metaTitle || '',
          metaKeywords: blog.metaKeywords || [],
          metaDescription: blog.metaDescription || '',
        });
      } catch (error) {
        console.error(error);
        toast.error('Failed to load blog data.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, router]);

  // --- Update blog
  const handleUpdate = async () => {
    if (!blogData.category) return toast.error('Category is required!');
    if (!blogData.title.trim()) return toast.error('Title is required!');
    if (!blogData.coverImageUrl) return toast.error('Cover image is required!');

    try {
      setLoading(true);

      const updatedData = {
        _id: id,
        category: blogData.category,
        title: blogData.title,
        description: blogData.shortDescription,
        coverImage: blogData.coverImageUrl,
        content,
        tags,
        metaTitle: seoData.metaTitle,
        metaKeywords: seoData.metaKeywords,
        metaDescription: seoData.metaDescription,
        status: 'active',
      };

      const res = await axios.patch('/api/v1/blog', updatedData);

      if (res.data.success) {
        toast.success('Blog updated successfully!');
        router.push('/general/view/all/blogs');
      } else {
        toast.error(res.data.message || 'Update failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update blog.');
    } finally {
      setLoading(false);
    }
  };

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

      <BlogForm formData={blogData} setFormData={setBlogData} />

      <RichTextEditor value={content} onChange={setContent} />

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
