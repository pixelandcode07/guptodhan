"use client"

import React from 'react'
import { Switch } from '@/components/ui/switch'

export type FilterState = {
  priceMin?: number
  priceMax?: number
  fastShipping?: boolean
  onlyAvailable?: boolean
  brand?: string
  color?: string
  size?: string
  rating?: number
}

export default function FilterSidebar({ value, onChange }: { value: FilterState, onChange: (next: FilterState) => void }) {
  const update = (patch: Partial<FilterState>) => onChange({ ...value, ...patch })

  return (
    <aside className="w-64 shrink-0 hidden md:block">
      <div className="bg-white border rounded-md p-4 space-y-4 sticky top-4">
        <div>
          <div className="text-sm font-medium mb-2">Price</div>
          <div className="flex items-center gap-2">
            <input type="number" placeholder="Min" className="h-9 w-full border rounded px-3 text-sm" value={value.priceMin ?? ''} onChange={e => update({ priceMin: Number(e.target.value) || undefined })} />
            <input type="number" placeholder="Max" className="h-9 w-full border rounded px-3 text-sm" value={value.priceMax ?? ''} onChange={e => update({ priceMax: Number(e.target.value) || undefined })} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center justify-between text-sm">
            <span>Fast shipping</span>
            <Switch checked={!!value.fastShipping} onCheckedChange={checked => update({ fastShipping: checked })} />
          </label>
          <label className="flex items-center justify-between text-sm">
            <span>Only available items</span>
            <Switch checked={!!value.onlyAvailable} onCheckedChange={checked => update({ onlyAvailable: checked })} />
          </label>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Brand</div>
          <div className="space-y-1 text-sm">
            {['Acme', 'Globex', 'Umbrella'].map(b => (
              <label key={b} className="flex items-center gap-2">
                <input type="radio" name="brand" checked={value.brand === b} onChange={() => update({ brand: value.brand === b ? undefined : b })} />
                {b}
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Color</div>
          <div className="flex items-center gap-3">
            {['black', 'red', 'blue'].map(c => (
              <button key={c} onClick={() => update({ color: value.color === c ? undefined : c })} className={`h-5 w-5 rounded-full border ${c === 'black' ? 'bg-black' : c === 'red' ? 'bg-red-500' : 'bg-blue-500'} ${value.color === c ? 'ring-2 ring-blue-600' : ''}`} aria-label={c} />
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Size</div>
          <div className="space-y-1 text-sm">
            {['S', 'M', 'L', 'XL'].map(s => (
              <label key={s} className="flex items-center gap-2">
                <input type="radio" name="size" checked={value.size === s} onChange={() => update({ size: value.size === s ? undefined : s })} />
                {s}
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Rating</div>
          <div className="space-y-1 text-sm">
            {[5,4,3].map(r => (
              <label key={r} className="flex items-center gap-2">
                <input type="radio" name="rating" checked={value.rating === r} onChange={() => update({ rating: value.rating === r ? undefined : r })} />
                {r} star{r>1?'s':''} & up
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}


