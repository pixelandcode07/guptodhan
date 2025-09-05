'use client';

import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  initialTags?: string[];
  onChange?: (tags: string[]) => void;
  name: string;
}

export default function TagInput({
  initialTags = [],
  onChange,
  name,
}: TagInputProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState('');

  const addTag = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        const newTags = [...tags, inputValue.trim()];
        setTags(newTags);
        onChange?.(newTags);
      }
      setInputValue('');
    }
  };

  const removeTag = (tag: string) => {
    const newTags = tags.filter(t => t !== tag);
    setTags(newTags);
    onChange?.(newTags);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border rounded px-2 py-1 min-h-[42px] cursor-text">
      {tags.map((tag, idx) => (
        <span
          key={idx}
          className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-[10px]">
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="text-blue-700 p-[1px] rounded-full cursor-pointer bg-blue-200 hover:text-red-600">
            <X size={10} />
          </button>
        </span>
      ))}

      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={addTag}
        placeholder={tags.length === 0 ? 'Enter keyword...' : ''}
        className="flex-1 border-none outline-none bg-transparent text-sm py-1"
      />

      {/* hidden input for form submit */}
      <input type="hidden" name={name} value={tags.join(',')} />
    </div>
  );
}
