import React from 'react'

type Product = { id: string, title: string, price: string, image: string }

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(p => (
        <div key={p.id} className="bg-white border rounded-md overflow-hidden">
          <img src={p.image} alt={p.title} className="w-full h-32 object-cover" />
          <div className="p-3">
            <div className="text-xs text-gray-500">Brand: Acme</div>
            <div className="text-sm font-medium line-clamp-2">{p.title}</div>
            <div className="text-blue-600 text-sm font-semibold mt-1">{p.price}</div>
          </div>
        </div>
      ))}
    </div>
  )
}


