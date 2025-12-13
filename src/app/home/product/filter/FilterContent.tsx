"use client"

import React from 'react'
import FilterSidebar, { type FilterState } from './components/FilterSidebar'
import ProductGrid from './components/ProductGrid'

type Product = { id: string, title: string, price: string, image: string }

export default function FilterContent({ products }: { products: Product[] }) {
  const [filters, setFilters] = React.useState<FilterState>({})
  const [sortBy, setSortBy] = React.useState('popularity')

  return (
    <div className="flex gap-6 mt-4">
      <FilterSidebar value={filters} onChange={setFilters} />

      <main className="flex-1">
        <div className="bg-white border rounded-md px-4 py-2 mb-4 flex items-center justify-between">
          <div className="text-xs text-gray-500">2500+ products • 4.9 rating</div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600">Sort by</div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="h-9 border rounded-md px-3 text-sm">
              <option value="popularity">Popularity</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        <ProductGrid products={products} />

       
      </main>
    </div>
  )
}


