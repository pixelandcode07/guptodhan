'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Image as ImageIcon, X } from 'lucide-react';
import { RichTextEditor } from '@/components/RichTextEditor/RichTextEditor';
import { Checkbox } from '@/components/ui/checkbox';
import SectionTitle from '@/components/ui/SectionTitle';

export default function Page() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');

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

  // Keywords input
  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && keywordInput.trim()) {
      e.preventDefault();
      if (!keywords.includes(keywordInput.trim())) {
        setKeywords([...keywords, keywordInput.trim()]);
      }
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  return (
    <div className="pt-5">
      <SectionTitle text="Page SEO Information" />

      <div className=" space-y-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="col-span-1">
          <div className="w-full">
            <CardContent className="space-y-6">
              {/* Feature Image */}
              <div className="space-y-2">
                <Label htmlFor="image">
                  Page Feature Image{' '}
                  <span className="text-gray-500">(1112px × 400px)</span>
                </Label>
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
                        name="image"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Meta Title */}
              <div className="space-y-2">
                <Label htmlFor="meta_title">
                  Page Meta Title{' '}
                  <small className="text-blue-500 font-semibold">(SEO)</small>
                </Label>
                <Input
                  id="meta_title"
                  name="meta_title"
                  placeholder="Meta Title"
                />
              </div>

              {/* Meta Keywords */}
              <div className="space-y-2">
                <Label htmlFor="meta_keywords">
                  Page Meta Keywords{' '}
                  <small className="text-blue-500 font-semibold">(SEO)</small>
                </Label>
                <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                  {keywords.map((keyword, index) => (
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
                    name="meta_keywords"
                    value={keywordInput}
                    onChange={e => setKeywordInput(e.target.value)}
                    onKeyDown={handleKeywordKeyDown}
                    placeholder="Type keyword & press Enter"
                    className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 w-auto flex-1 min-w-[120px]"
                  />
                </div>
              </div>

              {/* Meta Description */}
              <div className="space-y-2">
                <Label htmlFor="meta_description">
                  Page Meta Description{' '}
                  <small className="text-blue-500 font-semibold">(SEO)</small>
                </Label>
                <Textarea
                  id="meta_description"
                  name="meta_description"
                  placeholder="Meta Description Here"
                  rows={5}
                />
              </div>
            </CardContent>
          </div>
        </div>

        <div className="p-5 col-span-2">
          <div className="space-y-2">
            <Label htmlFor="page_title">
              Page Title <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              id="page_title"
              name="page_title"
              placeholder="Page Title"
              required
            />
            <p className="text-sm text-red-500"> {/* error message here */} </p>
          </div>

          <RichTextEditor />

          <div className="flex mt-4 gap-6">
            {/* Show in Header */}
            <div className="flex items-center space-x-2 cursor-pointer">
              <Checkbox id="show_in_header" name="show_in_header" value="1" />
              <Label htmlFor="show_in_header">Show in Header</Label>
            </div>

            {/* Show in Footer */}
            <div className="flex items-center space-x-2 cursor-pointer">
              <Checkbox id="show_in_footer" name="show_in_footer" value="1" />
              <Label htmlFor="show_in_footer">Show in Footer</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
