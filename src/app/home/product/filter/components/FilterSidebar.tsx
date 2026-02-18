"use client"

import React from 'react'
import { Filter, X, Minus, Check } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type FilterState = {
  priceMin?: number
  priceMax?: number
  brand?: string
  color?: string
  size?: string
  rating?: number
}

type ColorOption = {
  name: string;
  hex: string;
}

type SidebarProps = {
  value: FilterState;
  onChange: (next: FilterState) => void;
  options: {
    brands: string[];
    colors: ColorOption[];
    sizes: string[];
  }
}

// ✅ ১. ফলব্যাক (Fallback) ডাটা: যদি API থেকে ডাটা না আসে, এগুলো দেখাবে
const STATIC_COLORS: ColorOption[] = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#22C55E' },
  { name: 'Yellow', hex: '#EAB308' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Purple', hex: '#A855F7' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Gray', hex: '#6B7280' },
  { name: 'Brown', hex: '#78350F' },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Teal', hex: '#14B8A6' },
  { name: 'Maroon', hex: '#7F1D1D' },
  { name: 'Gold', hex: '#FFD700' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Beige', hex: '#F5F5DC' },
];

const STATIC_BRANDS = ['Edifier', 'Havit', 'Microlab', 'HP', 'Logitech', 'A4Tech'];
const STATIC_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function FilterSidebar({ value, onChange, options }: SidebarProps) {
  const update = (patch: Partial<FilterState>) => onChange({ ...value, ...patch })
  const hasFilters = Object.values(value).some(v => v !== undefined);

  // ✅ ২. স্মার্ট চেকিং: যদি options.brands খালি থাকে, তাহলে STATIC_BRANDS দেখাবে
  const brandsToRender = options.brands && options.brands.length > 0 
    ? options.brands 
    : STATIC_BRANDS;

  // ✅ কালারের জন্য একই লজিক
  const colorsToRender = options.colors && options.colors.length > 0 
    ? options.colors 
    : STATIC_COLORS;

  // ✅ সাইজের জন্য একই লজিক
  const sizesToRender = options.sizes && options.sizes.length > 0 
    ? options.sizes 
    : STATIC_SIZES;

  return (
    <aside className="w-full md:w-64 shrink-0 font-sans">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm sticky top-24 flex flex-col max-h-[calc(100vh-100px)]">
        
        {/* Header Section */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white rounded-t-xl z-10">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </div>
          {hasFilters && (
            <button 
              onClick={() => onChange({})}
              className="text-[11px] font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1"
            >
              Reset
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Price Range Filter */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Price Range</h3>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input 
                  type="number" 
                  placeholder="Min" 
                  className="w-full pl-3 pr-2 h-9 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-slate-800 transition-all placeholder:text-slate-400" 
                  value={value.priceMin ?? ''} 
                  onChange={e => update({ priceMin: Number(e.target.value) || undefined })} 
                />
              </div>
              <Minus className="w-3 h-3 text-slate-300" />
              <div className="relative flex-1">
                <input 
                  type="number" 
                  placeholder="Max" 
                  className="w-full pl-3 pr-2 h-9 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-slate-800 transition-all placeholder:text-slate-400" 
                  value={value.priceMax ?? ''} 
                  onChange={e => update({ priceMax: Number(e.target.value) || undefined })} 
                />
              </div>
            </div>
          </section>

          <div className="h-px bg-slate-100" />

          {/* Brand Filter */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Brand</h3>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {brandsToRender.length}
              </span>
            </div>
            <div className="space-y-1">
              {brandsToRender.map(brand => {
                const isActive = value.brand === brand;
                return (
                  <label 
                    key={brand} 
                    className="flex items-center gap-3 cursor-pointer group py-1 hover:bg-slate-50 px-2 rounded-md transition-colors -mx-2"
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                      isActive ? 'border-slate-800 bg-slate-800' : 'border-slate-300 group-hover:border-slate-400'
                    }`}>
                      {isActive && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <span className={`text-sm ${isActive ? 'font-semibold text-slate-900' : 'text-slate-600 group-hover:text-slate-800'}`}>
                      {brand}
                    </span>
                    <input 
                      type="radio" 
                      name="brand" 
                      className="hidden"
                      checked={isActive} 
                      onChange={() => update({ brand: isActive ? undefined : brand })} 
                    />
                  </label>
                )
              })}
            </div>
          </section>

          <div className="h-px bg-slate-100" />

          {/* Color Filter (Dropdown) */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Color</h3>
            
            <Select 
              value={value.color || ""} 
              onValueChange={(val) => update({ color: val === "all_colors_reset" ? undefined : val })}
            >
              <SelectTrigger className="w-full h-10 border-slate-200 focus:ring-slate-800 bg-white">
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="all_colors_reset" className="cursor-pointer font-medium text-slate-500">
                  All Colors
                </SelectItem>
                {colorsToRender.map((colorObj, index) => {
                  if (!colorObj || !colorObj.name) return null;
                  const isWhite = colorObj.name.toLowerCase() === 'white';
                  return (
                    <SelectItem key={index} value={colorObj.name} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span 
                          className={`w-3.5 h-3.5 rounded-full border shadow-sm ${isWhite ? 'border-slate-300' : 'border-transparent'}`}
                          style={{ backgroundColor: colorObj.hex || '#000' }}
                        />
                        <span className="capitalize">{colorObj.name}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </section>

          <div className="h-px bg-slate-100" />

          {/* Size Filter */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Size</h3>
            <div className="grid grid-cols-4 gap-2">
              {sizesToRender.map(size => {
                const isActive = value.size === size;
                return (
                  <button
                    key={size}
                    onClick={() => update({ size: isActive ? undefined : size })}
                    className={`h-9 text-xs font-bold rounded border transition-all truncate px-1 ${
                      isActive 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                    title={size}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
          </section>

        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
      `}</style>
    </aside>
  )
}