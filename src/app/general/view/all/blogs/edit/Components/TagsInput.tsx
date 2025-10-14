'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dispatch, SetStateAction } from 'react';

interface TagsInputProps {
  tags: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
}

export default function TagsInput({ tags, setTags }: TagsInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      e.currentTarget.value = '';
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <div className="w-full space-y-2">
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
          onKeyDown={handleKeyDown}
          placeholder="Type and press Enter"
          className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 w-auto flex-1 min-w-[120px]"
        />
      </div>
    </div>
  );
}
