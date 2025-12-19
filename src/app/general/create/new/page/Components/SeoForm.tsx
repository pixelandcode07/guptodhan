'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, X } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import RichTextEditor from '@/components/ReusableComponents/RichTextEditor';
import { toast } from 'sonner';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type SeoFormProps = {
  defaultData: {
    pageTitle: string;
    metaTitle: string;
    metaKeywords: string[];
    metaDescription: string;
    showInHeader: boolean;
    showInFooter: boolean;
    pageContent: string;
  };
};

export default function SeoForm({ defaultData }: SeoFormProps) {
  const { data: session, status } = useSession();
  const router = useRouter();


  const [pageTitle, setPageTitle] = useState(defaultData.pageTitle);
  const [metaTitle, setMetaTitle] = useState(defaultData.metaTitle);
  const [metaKeywords, setMetaKeywords] = useState(defaultData.metaKeywords);
  const [keywordInput, setKeywordInput] = useState('');
  const [metaDescription, setMetaDescription] = useState(defaultData.metaDescription);
  const [pageContent, setPageContent] = useState(defaultData.pageContent);
  const [showInHeader, setShowInHeader] = useState(defaultData.showInHeader);
  const [showInFooter, setShowInFooter] = useState(defaultData.showInFooter);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pageIdentifier = useMemo(() => {
    if (!pageTitle.trim()) return '';
    return pageTitle
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }, [pageTitle]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push('/');
    return null;
  }

  const userRole = (session.user as any)?.role || (session.user as any)?.userRole;
  if (userRole !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-red-800">Access Denied</h2>
          <p className="mt-4 text-gray-700">Only admins can access this page.</p>
          <Button className="mt-6" onClick={() => router.push('/')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  // Handlers
  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && keywordInput.trim()) {
      e.preventDefault();
      const kw = keywordInput.trim();
      if (!metaKeywords.includes(kw)) {
        setMetaKeywords(prev => [...prev, kw]);
      }
      setKeywordInput('');
    }
  };

  const removeKeyword = (kw: string) => {
    setMetaKeywords(prev => prev.filter(k => k !== kw));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1 * 1024 * 1024) {
      toast.error('Image must be less than 1MB');
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleUpdate = async () => {
    if (!pageTitle.trim()) return toast.error('Page Title is required');
    if (!metaTitle.trim()) return toast.error('Meta Title is required');

    setLoading(true);
    const formData = new FormData();

    formData.append('pageIdentifier', pageIdentifier);
    formData.append('metaTitle', metaTitle);
    formData.append('metaDescription', metaDescription);
    formData.append('metaKeywords', metaKeywords.join(','));
    formData.append('pageContent', pageContent);
    formData.append('showInHeader', String(showInHeader));
    formData.append('showInFooter', String(showInFooter));
    if (image) formData.append('ogImage', image);

    try {
      await axios.post('/api/v1/seo-settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Page created successfully! Ready for the next one.');
      setPageTitle('');
      setMetaTitle('');
      setMetaKeywords([]);
      setKeywordInput('');
      setMetaDescription('');
      setPageContent('');
      setShowInHeader(false);
      setShowInFooter(false);
      setImage(null);
      setPreview(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto p-6">
      {/* Left: SEO */}
      <div className="space-y-6">
        <CardContent className="space-y-6 border rounded-lg">
          {/* <div className="bg-green-50 p-4 rounded">
            <p className="font-medium">Logged in as Admin</p>
          </div> */}

          {/* OG Image */}
          <div className="p-4">
            <Label className='mb-2'>OG Image (1200×630)</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              {preview ? (
                <div className="relative inline-block">
                  <img src={preview} alt="preview" className="max-h-48 rounded mx-auto" />
                  <button onClick={removeImage} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <Input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="ogimg" />
                  <label htmlFor="ogimg" className="cursor-pointer text-blue-600 hover:underline">
                    Choose Image (max 1MB)
                  </label>
                </>
              )}
            </div>
          </div>

          <div>
            <Label className='mb-2'>Meta Title *</Label>
            <Input value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder="60 chars recommended" />
          </div>

          <div>
            <Label className='mb-2'>Meta Keywords</Label>
            <div className="border rounded p-3 flex flex-wrap gap-2 items-center min-h-12">
              {metaKeywords.map(kw => (
                <Badge key={kw} variant="secondary" className="pl-3 pr-2 py-1">
                  {kw}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => removeKeyword(kw)} />
                </Badge>
              ))}
              <Input
                value={keywordInput}
                onChange={e => setKeywordInput(e.target.value)}
                onKeyDown={handleKeywordKeyDown}
                placeholder="Type & press Enter"
                className="border-0 flex-1 min-w-32"
              />
            </div>
          </div>

          <div>
            <Label className='mb-2'>Meta Description *</Label>
            <Textarea
              value={metaDescription}
              onChange={e => setMetaDescription(e.target.value)}
              rows={4}
              placeholder="150-160 characters"
            />
          </div>
        </CardContent>
      </div>

      {/* Right: Page Content */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <Label className='mb-2'>Page Title *</Label>
          <Input value={pageTitle} onChange={e => setPageTitle(e.target.value)} placeholder="About Us, Contact" />
          <p className="text-sm text-gray-600 mt-2">
            URL Slug: <code className="bg-gray-100 px-2 py-1 rounded font-mono">
              {pageIdentifier || 'your-page-slug'}
            </code>
          </p>
        </div>

        <div>
          <Label className='mb-2'>Page Content</Label>
          <RichTextEditor value={pageContent} onChange={setPageContent} />
        </div>

        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <Checkbox checked={showInHeader} onCheckedChange={setShowInHeader} />
            <Label>Show in Header Menu</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={showInFooter} onCheckedChange={setShowInFooter} />
            <Label>Show in Footer Menu</Label>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          {/* <Button onClick={handleUpdate} disabled={loading || !pageTitle.trim() || !metaTitle.trim()}>
            {loading ? 'Saving...' : 'Create Page & SEO'}
          </Button> */}
          <Button onClick={handleUpdate} disabled={loading || !pageTitle.trim() || !metaTitle.trim()}>
            {loading ? 'Creating...' : 'Create Page'}
          </Button>
        </div>
      </div>
    </div>
  );
}