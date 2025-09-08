'use client'; // this handles all interactivity

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, X } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import RichTextEditor from '@/components/ReusableComponents/RichTextEditor';

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
  const [pageTitle, setPageTitle] = useState(defaultData.pageTitle);
  const [metaTitle, setMetaTitle] = useState(defaultData.metaTitle);
  const [metaKeywords, setMetaKeywords] = useState(defaultData.metaKeywords);
  const [keywordInput, setKeywordInput] = useState('');
  const [metaDescription, setMetaDescription] = useState(
    defaultData.metaDescription
  );
  const [showInHeader, setShowInHeader] = useState(defaultData.showInHeader);
  const [showInFooter, setShowInFooter] = useState(defaultData.showInFooter);
  const [pageContent, setPageContent] = useState(defaultData.pageContent);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [content, setContent] = useState('');

  // Keywords
  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && keywordInput.trim()) {
      e.preventDefault();
      if (!metaKeywords.includes(keywordInput.trim())) {
        setMetaKeywords([...metaKeywords, keywordInput.trim()]);
      }
      setKeywordInput('');
    }
  };
  const removeKeyword = (keyword: string) =>
    setMetaKeywords(metaKeywords.filter(k => k !== keyword));

  // Image upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleUpdate = () => {
    // Here you can send all state to backend API
    console.log({
      pageTitle,
      metaTitle,
      metaKeywords,
      metaDescription,
      showInHeader,
      showInFooter,
      pageContent,
      image,
    });
    alert('SEO Information Updated!');
  };

  return (
    <div className="space-y-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
      <div className="col-span-1">
        <CardContent className="space-y-6">
          {/* Feature Image */}
          <div className="space-y-2">
            <Label htmlFor="image">Page Feature Image (1112px × 400px)</Label>
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="rounded-md max-h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Drag and drop a file here or click
                  </p>
                  <Input
                    id="image"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </>
              )}
            </div>
          </div>

          {/* Meta Title */}
          <div className="space-y-2">
            <Label htmlFor="meta_title">Page Meta Title (SEO)</Label>
            <Input
              id="meta_title"
              value={metaTitle}
              onChange={e => setMetaTitle(e.target.value)}
              placeholder="Meta Title"
            />
          </div>

          {/* Meta Keywords */}
          <div className="space-y-2">
            <Label htmlFor="meta_keywords">Page Meta Keywords (SEO)</Label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md">
              {metaKeywords.map((keyword, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1">
                  {keyword}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                    onClick={() => removeKeyword(keyword)}
                  />
                </Badge>
              ))}
              <Input
                id="meta_keywords"
                value={keywordInput}
                onChange={e => setKeywordInput(e.target.value)}
                onKeyDown={handleKeywordKeyDown}
                placeholder="Type keyword & press Enter"
                className="border-none shadow-none focus-visible:ring-0 w-auto flex-1 min-w-[120px]"
              />
            </div>
          </div>

          {/* Meta Description */}
          <div className="space-y-2">
            <Label htmlFor="meta_description">
              Page Meta Description (SEO)
            </Label>
            <Textarea
              id="meta_description"
              value={metaDescription}
              onChange={e => setMetaDescription(e.target.value)}
              rows={5}
              placeholder="Meta Description Here"
            />
          </div>
        </CardContent>
      </div>

      <div className="p-5 col-span-2 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="page_title">
            Page Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="page_title"
            value={pageTitle}
            onChange={e => setPageTitle(e.target.value)}
            required
            placeholder="Page Title"
          />
        </div>

        <RichTextEditor value={content} onChange={setContent} />

        <div className="flex mt-4 gap-6">
          <div className="flex items-center space-x-2 cursor-pointer">
            <Checkbox
              checked={showInHeader}
              onCheckedChange={value => setShowInHeader(!!value)}
            />
            <Label>Show in Header</Label>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer">
            <Checkbox
              checked={showInFooter}
              onCheckedChange={value => setShowInFooter(!!value)}
            />
            <Label>Show in Footer</Label>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={handleUpdate}>Update SEO</Button>
        </div>
      </div>
    </div>
  );
}
