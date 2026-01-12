import React, { useState, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  id?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const normalizeTag = (tag: string) =>
  tag
    .replace(/,/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

const TagInput: React.FC<TagInputProps> = ({
  id,
  value,
  onChange,
  placeholder = 'Type and press comma or enter',
  disabled = false,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addTag = useCallback(
    (rawTag: string) => {
      const tag = normalizeTag(rawTag);
      setInputValue('');
      if (!tag) return false;

      const exists = value.some(
        (existing) => existing.toLowerCase() === tag.toLowerCase()
      );
      if (exists) return false;

      onChange([...value, tag]);
      return true;
    },
    [onChange, value]
  );

  const addMultipleTags = useCallback(
    (text: string) => {
      const tags = text
        .split(',')
        .map(normalizeTag)
        .filter(Boolean);
      
      const newTags: string[] = [];
      tags.forEach((tag) => {
        const exists = value.some(
          (existing) => existing.toLowerCase() === tag.toLowerCase()
        );
        if (!exists) {
          newTags.push(tag);
        }
      });

      if (newTags.length > 0) {
        onChange([...value, ...newTags]);
      }
      setInputValue('');
    },
    [onChange, value]
  );

  const handleRemove = (index: number) => {
    if (disabled) return;
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      // If input contains commas, split and add all tags
      if (inputValue.includes(',')) {
        addMultipleTags(inputValue);
      } else {
        addTag(inputValue);
      }
    } else if (event.key === 'Backspace' && inputValue === '' && value.length) {
      event.preventDefault();
      onChange(value.slice(0, -1));
    }
  };

  const handleBlur = () => {
    if (disabled) return;
    // If input contains commas, split and add all tags
    if (inputValue.includes(',')) {
      addMultipleTags(inputValue);
    } else {
      addTag(inputValue);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    const text = event.clipboardData.getData('text');
    
    // Always process pasted text if it contains commas
    if (text.includes(',')) {
      event.preventDefault();
      addMultipleTags(text);
    }
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-2 border border-gray-300 rounded-md px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-shadow ${
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      } ${className}`}
      onClick={() => {
        if (disabled) return;
        inputRef.current?.focus();
      }}
    >
      {value.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs sm:text-sm"
        >
          {tag}
          {!disabled && (
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="text-blue-600 hover:text-blue-800 focus-visible:outline-none"
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </span>
      ))}

      {!disabled && (
        <input
          id={id}
          ref={inputRef}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onPaste={handlePaste}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] border-none bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-0"
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default TagInput;

