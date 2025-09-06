'use client';

import { useState } from 'react';
import BlogForm from './BlogEntryForm';
import BlogSeoForm from './BlogSeoInfo';
import TagsInput from './TagInput';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/ui/SectionTitle';
import RichTextEditor from '@/components/ReusableComponents/RichTextEditor';

export type BlogData = {
  category: string;
  title: string;
  shortDescription: string;
  coverImage: File | null;
};

export type SeoData = {
  metaTitle: string;
  metaKeywords: string[];
  metaDescription: string;
};
export default function BlogEntryFormWrapper() {
  // 1. BlogForm state
  const [blogData, setBlogData] = useState<BlogData>({
    category: '',
    title: '',
    shortDescription: '',
    coverImage: null as File | null,
  });

  // 2. Tags state
  const [tags, setTags] = useState<string[]>([]);

  // 3. SEO state
  const [seoData, setSeoData] = useState<SeoData>({
    metaTitle: '',
    metaKeywords: [] as string[],
    metaDescription: '',
  });

  // 4. RichTextEditor content
  const [content, setContent] = useState('');

  const handleUpdate = () => {
    const formData = {
      blogData,
      tags,
      seoData,
      content, // RichText content
    };

    console.log('Form Data Object:', formData);
    alert('Form updated!');
  };

  return (
    <div className="pt-5 bg-white space-y-4">
      <SectionTitle text="Blog Entry Form" />
      <div className="px-5 pt-4 space-y-4">
        <BlogForm formData={blogData} setFormData={setBlogData} />
        <RichTextEditor value={content} onChange={setContent} />
        <TagsInput tags={tags} setTags={setTags} />
        <BlogSeoForm seoData={seoData} setSeoData={setSeoData} />
      </div>

      <div className="flex justify-center pb-5 gap-4 mt-6">
        <Button variant="destructive" onClick={() => console.log('Cancelled')}>
          Cancel
        </Button>
        <Button onClick={handleUpdate}>Update</Button>
      </div>
    </div>
  );
}
