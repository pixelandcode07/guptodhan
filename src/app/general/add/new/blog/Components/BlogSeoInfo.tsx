'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function BlogSeoForm() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');

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
    <Card className="w-full ">
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
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input id="meta_title" name="meta_title" placeholder="Meta Title" />
          </div>

          {/* Meta Keywords */}
          <div className="space-y-2">
            <Label htmlFor="meta_keywords">Meta Keywords</Label>
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
        </div>

        {/* Meta Description */}
        <div className="mt-6 space-y-2">
          <Label htmlFor="meta_description">Meta Description</Label>
          <Textarea
            id="meta_description"
            name="meta_description"
            placeholder="Meta Description Here"
          />
        </div>
      </CardContent>
    </Card>
  );
}
