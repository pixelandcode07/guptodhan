'use client';

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, ChevronsUpDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchableOption {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  options: SearchableOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = 'Select option',
  disabled = false,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'w-full h-11 justify-between bg-white px-3 font-normal text-left border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 rounded-md',
            !value && 'text-gray-400',
            disabled && 'cursor-not-allowed opacity-50 bg-gray-100',
            className
          )}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] min-w-[220px] p-2 bg-white shadow-xl rounded-lg border border-gray-200 z-50">
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Type to search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-8 h-9 text-xs border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            autoFocus
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="max-h-60 overflow-y-auto space-y-0.5 text-sm">
          {filteredOptions.length === 0 ? (
            <div className="p-3 text-center text-xs text-gray-500">
              No results found
            </div>
          ) : (
            filteredOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <div
                  key={opt.value}
                  onClick={() => {
                    onValueChange(opt.value);
                    setOpen(false);
                    setSearch('');
                  }}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-xs sm:text-sm transition-colors',
                    isSelected
                      ? 'bg-blue-50 font-semibold text-blue-700'
                      : 'hover:bg-gray-100 text-gray-800'
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="h-4 w-4 text-blue-600 shrink-0 ml-2" />}
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
