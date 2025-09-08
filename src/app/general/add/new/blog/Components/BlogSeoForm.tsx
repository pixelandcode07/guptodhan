'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dispatch, SetStateAction } from 'react';

export interface SeoData {
  metaTitle: string;
  metaKeywords: string[];
  metaDescription: string;
  metaKeywordsInput?: string;
}

interface BlogSeoFormProps {
  seoData: SeoData;
  setSeoData: Dispatch<SetStateAction<SeoData>>;
}

export default function BlogSeoForm({ seoData, setSeoData }: BlogSeoFormProps) {
  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && seoData.metaKeywordsInput) {
      e.preventDefault();
      const keyword = seoData.metaKeywordsInput.trim();
      if (keyword && !seoData.metaKeywords.includes(keyword)) {
        setSeoData({
          ...seoData,
          metaKeywords: [...seoData.metaKeywords, keyword],
          metaKeywordsInput: '',
        });
      }
    }
  };

  const removeKeyword = (keyword: string) => {
    setSeoData({
      ...seoData,
      metaKeywords: seoData.metaKeywords.filter((k: string) => k !== keyword),
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          Blog SEO Information{' '}
          <small className="text-red-600 font-semibold">(Optional)</small>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Meta Title */}
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              value={seoData.metaTitle}
              onChange={e =>
                setSeoData({ ...seoData, metaTitle: e.target.value })
              }
              placeholder="Meta Title"
            />
          </div>

          {/* Meta Keywords */}
          <div className="space-y-2">
            <Label htmlFor="metaKeywords">Meta Keywords</Label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md">
              {seoData.metaKeywords.map((keyword: string, index: number) => (
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
                id="metaKeywords"
                value={seoData.metaKeywordsInput || ''}
                onChange={e =>
                  setSeoData({ ...seoData, metaKeywordsInput: e.target.value })
                }
                onKeyDown={handleKeywordKeyDown}
                placeholder="Type keyword & press Enter"
                className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 w-auto flex-1 min-w-[120px]"
              />
            </div>
          </div>
        </div>

        {/* Meta Description */}
        <div className="mt-6 space-y-2">
          <Label htmlFor="metaDescription">Meta Description</Label>
          <Textarea
            id="metaDescription"
            value={seoData.metaDescription}
            onChange={e =>
              setSeoData({ ...seoData, metaDescription: e.target.value })
            }
            placeholder="Meta Description Here"
          />
        </div>
      </CardContent>
    </Card>
  );
}
