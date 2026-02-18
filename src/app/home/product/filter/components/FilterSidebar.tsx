"use client"

import React from 'react'
import { Filter, X, Minus } from 'lucide-react'

export type FilterState = {
  priceMin?: number
  priceMax?: number
  brand?: string
  color?: string
  size?: string
  rating?: number
}

type SidebarProps = {
  value: FilterState;
  onChange: (next: FilterState) => void;
  options: {
    brands: string[];
    colors: string[];
    sizes: string[];
  }
}

export default function FilterSidebar({ value, onChange, options }: SidebarProps) {
  const update = (patch: Partial<FilterState>) => onChange({ ...value, ...patch })
  const hasFilters = Object.values(value).some(v => v !== undefined);

  return (
    <aside className="w-full md:w-64 shrink-0 font-sans">
      <div className="bg-white border border-slate-100 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] sticky top-24 overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
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

        <div className="p-5 space-y-6 h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
          
          {/* Price Range */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Price Range</h3>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input 
                  type="number" 
                  placeholder="Min" 
                  className="w-full pl-3 pr-2 h-9 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-slate-400 focus:ring-0 transition-all placeholder:text-slate-400" 
                  value={value.priceMin ?? ''} 
                  onChange={e => update({ priceMin: Number(e.target.value) || undefined })} 
                />
              </div>
              <Minus className="w-3 h-3 text-slate-300" />
              <div className="relative flex-1">
                <input 
                  type="number" 
                  placeholder="Max" 
                  className="w-full pl-3 pr-2 h-9 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-slate-400 focus:ring-0 transition-all placeholder:text-slate-400" 
                  value={value.priceMax ?? ''} 
                  onChange={e => update({ priceMax: Number(e.target.value) || undefined })} 
                />
              </div>
            </div>
          </section>

          <div className="h-px bg-slate-100" />

          {/* Brand Filter */}
          {options.brands.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Brand</h3>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {options.brands.length}
                </span>
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                {options.brands.map(brand => {
                  const isActive = value.brand === brand;
                  return (
                    <label 
                      key={brand} 
                      className="flex items-center gap-3 cursor-pointer group py-1"
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                        isActive ? 'border-blue-600' : 'border-slate-300 group-hover:border-slate-400'
                      }`}>
                        {isActive && <div className="w-2 h-2 rounded-full bg-blue-600" />}
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
          )}

          {options.colors.length > 0 && <div className="h-px bg-slate-100" />}

          {/* ✅ Color Filter (লিস্ট আকারে ডিজাইন) */}
          {options.colors.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Color</h3>
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                {options.colors.map(color => {
                  const isActive = value.color === color;
                  const isWhite = color.toLowerCase() === 'white' || color.toLowerCase() === '#ffffff';
                  
                  return (
                    <label 
                      key={color} 
                      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all group ${
                        isActive ? 'bg-slate-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* কালার সার্কেল */}
                        <span 
                          className={`w-5 h-5 rounded-full shadow-sm border ${isWhite ? 'border-slate-300' : 'border-transparent'}`}
                          style={{ backgroundColor: color }}
                        />
                        <span className={`text-sm capitalize ${isActive ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                          {color}
                        </span>
                      </div>
                      
                      {/* রেডিও বাটন (ডানপাশে) */}
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                        isActive ? 'border-blue-600' : 'border-slate-300 group-hover:border-slate-400'
                      }`}>
                        {isActive && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                      </div>

                      <input 
                        type="radio" 
                        name="color" 
                        className="hidden"
                        checked={isActive} 
                        onChange={() => update({ color: isActive ? undefined : color })} 
                      />
                    </label>
                  )
                })}
              </div>
            </section>
          )}

          {options.sizes.length > 0 && <div className="h-px bg-slate-100" />}

          {/* Size Filter */}
          {options.sizes.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Size</h3>
              <div className="grid grid-cols-4 gap-2">
                {options.sizes.map(size => {
                  const isActive = value.size === size;
                  return (
                    <button
                      key={size}
                      onClick={() => update({ size: isActive ? undefined : size })}
                      className={`h-9 text-xs font-bold rounded border transition-all ${
                        isActive 
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* কাস্টম স্ক্রলবার সিএসএস */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #cbd5e1;
        }
      `}</style>
    </aside>
  )
}