'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function TagsInput() {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <div className="w-full  space-y-2">
      <Label htmlFor="tags">Tags (for search result)</Label>
      <div className="flex flex-wrap gap-2 p-2 border rounded-md">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-1">
            {tag}
            <X
              className="w-3 h-3 cursor-pointer hover:text-red-500"
              onClick={() => removeTag(tag)}
            />
          </Badge>
        ))}
        <Input
          id="tags"
          name="tags"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type and press Enter"
          className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 w-auto flex-1 min-w-[120px]"
        />
      </div>
    </div>
  );
}
