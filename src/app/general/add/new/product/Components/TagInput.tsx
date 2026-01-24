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

// শুধু বাড়তি স্পেস ক্লিন করার জন্য
const normalizeTag = (tag: string) => tag.trim().replace(/\s+/g, ' ');

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

  // একাধিক ট্যাগ একসাথে হ্যান্ডেল করার জন্য নতুন ফাংশন
  const addTags = useCallback(
    (rawInput: string) => {
      // কমা দিয়ে স্প্লিট করা হচ্ছে
      const newTags = rawInput
        .split(',')
        .map(normalizeTag)
        .filter((tag) => tag !== ''); // খালি ট্যাগ বাদ দেওয়া

      if (newTags.length === 0) return;

      const updatedTags = [...value];

      newTags.forEach((tag) => {
        const exists = updatedTags.some(
          (existing) => existing.toLowerCase() === tag.toLowerCase()
        );
        if (!exists) {
          updatedTags.push(tag);
        }
      });

      onChange(updatedTags);
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
      addTags(inputValue);
    } else if (event.key === 'Backspace' && inputValue === '' && value.length) {
      event.preventDefault();
      onChange(value.slice(0, -1));
    }
  };

  const handleBlur = () => {
    if (disabled) return;
    if (inputValue) addTags(inputValue);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    event.preventDefault();
    const text = event.clipboardData.getData('text');
    // পেস্ট করা টেক্সট সরাসরি addTags এ পাঠিয়ে দেওয়া হচ্ছে
    addTags(text);
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
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(index);
              }}
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