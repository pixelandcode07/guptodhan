'use client';

import { useState } from 'react';
import BlogForm, { BlogData } from './BlogForm';
import BlogSeoForm, { SeoData } from './BlogSeoForm';
import TagsInput from './TagInput';
import RichTextEditor from '@/components/ReusableComponents/RichTextEditor';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/ui/SectionTitle';
import { toast } from 'sonner';
import axios from 'axios';

export default function BlogEntryFormWrapper() {
  const [loading, setLoading] = useState(false);

  const [blogData, setBlogData] = useState<BlogData>({
    category: '',
    title: '',
    shortDescription: '',
    coverImageUrl: '', // Use URL
  });

  const [tags, setTags] = useState<string[]>([]);
  const [seoData, setSeoData] = useState<SeoData>({
    metaTitle: '',
    metaKeywords: [],
    metaDescription: '',
  });
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    // Validation
    if (!blogData.category) return toast.error('Category is required!');
    if (!blogData.title.trim()) return toast.error('Title is required!');
    if (!blogData.coverImageUrl) return toast.error('Cover image is required!');

    // const payload = {
    //   blogId: crypto.randomUUID(), // generate a unique string
    //   category: blogData.category,
    //   title: blogData.title,
    //   shortDescription: blogData.shortDescription,
    //   coverImage: blogData.coverImageUrl,
    //   content,
    //   tags,
    //   metaTitle: seoData.metaTitle,
    //   metaDescription: seoData.metaDescription,
    //   metaKeywords: seoData.metaKeywords,
    // };

    // const payload = {
    //   blogId: crypto.randomUUID(),
    //   category: blogData.category,
    //   title: blogData.title,
    //   description: blogData.shortDescription, // <-- use 'description'
    //   coverImage: blogData.coverImageUrl,
    //   content, // content can be sent if backend stores it inside description or separate field
    //   tags,
    //   metaTitle: seoData.metaTitle,
    //   metaDescription: seoData.metaDescription,
    //   metaKeywords: seoData.metaKeywords,
    // };

    const payload = {
      blogId: crypto.randomUUID(),
      // category: blogData.category, // <-- MUST be valid ObjectId
      category: '507f1f77bcf86cd799439011', //
      title: blogData.title,
      description: blogData.shortDescription, // shortDescription mapped to description
      coverImage: blogData.coverImageUrl,
      tags,
      metaTitle: seoData.metaTitle,
      metaDescription: seoData.metaDescription,
      metaKeywords: seoData.metaKeywords,
      status: 'active',
    };

    console.log(payload);
    try {
      setLoading(true);
      const res = await axios.post('/api/v1/blog', payload);
      toast.success('Blog created successfully!');
      console.log('Server Response:', res.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong!');
      console.error('Post Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-5 bg-white space-y-4">
      {/* <SectionTitle text="Blog Entry Form" /> */}

      <div className="px-5 pt-4 space-y-4">
        <BlogForm formData={blogData} setFormData={setBlogData} />
        <RichTextEditor value={content} onChange={setContent} />
        <TagsInput tags={tags} setTags={setTags} />
        <BlogSeoForm seoData={seoData} setSeoData={setSeoData} />
      </div>

      <div className="flex justify-center pb-5 gap-4 mt-6">
        <Button
          variant="destructive"
          onClick={() => console.log('Cancelled')}
          disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </Button>
      </div>
    </div>
  );
}
