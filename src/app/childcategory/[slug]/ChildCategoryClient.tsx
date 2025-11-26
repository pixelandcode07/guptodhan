// app/childcategory/[slug]/ChildCategoryClient.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition, useState } from 'react';
import { ShoppingCart, Package, Eye, Heart, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface Product {
  _id: string;
  productId: string;
  productTitle: string;
  thumbnailImage: string;
  productPrice: number;
  discountPrice: number;
  stock: number;
  sellCount: number;
  rewardPoints: number;
  brand?: string | null;
  productOptions?: Array<{
    size?: Array<{ name: string }>;
    price: number;
    discountPrice: number;
  }>;
}

interface ChildCategoryData {
  childCategory: { name: string; slug: string };
  products: Product[];
  totalProducts: number;
}

function extractFilters(products: Product[]) {
  const brands = new Set<string>();
  const sizes = new Set<string>();
  let minPrice = Infinity;
  let maxPrice = 0;

  products.forEach((p) => {
    if (p.brand) brands.add(p.brand);
    p.productOptions?.forEach((opt) => {
      opt.size?.forEach((s) => s.name && sizes.add(s.name));
      const price = opt.discountPrice > 0 ? opt.discountPrice : opt.price;
      minPrice = Math.min(minPrice, price);
      maxPrice = Math.max(maxPrice, price);
    });
    const mainPrice = p.discountPrice > 0 ? p.discountPrice : p.productPrice;
    minPrice = Math.min(minPrice, mainPrice);
    maxPrice = Math.max(maxPrice, mainPrice);
  });

  return {
    brands: Array.from(brands),
    sizes: Array.from(sizes),
    priceRange: {
      min: minPrice === Infinity ? 0 : Math.floor(minPrice),
      max: maxPrice === 0 ? 100000 : Math.ceil(maxPrice),
    },
  };
}

function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.productPrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.productPrice - product.discountPrice) / product.productPrice) * 100)
    : 0;

  return (
    <Link href={`/product/${product.productId}`} className="group block">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 border overflow-hidden">
        <div className="relative aspect-square bg-gray-50">
          <Image
            src={product.thumbnailImage || '/placeholder.jpg'}
            alt={product.productTitle}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && (
              <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                -{discountPercent}%
              </span>
            )}
            {product.stock === 0 && (
              <span className="px-2 py-1 text-xs font-bold text-white bg-black rounded-full">
                Out of Stock
              </span>
            )}
          </div>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button className="p-3 bg-white rounded-full"><Heart className="w-5 h-5" /></button>
            <button className="p-3 bg-white rounded-full"><Eye className="w-5 h-5" /></button>
            <button className="p-3 bg-blue-600 text-white rounded-full"><ShoppingCart className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600">{product.productTitle}</h3>
          <div className="mt-2 flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-lg font-bold text-red-600">৳{product.discountPrice.toLocaleString()}</span>
                <span className="text-sm text-gray-400 line-through">৳{product.productPrice.toLocaleString()}</span>
              </>
            ) : (
              <span className="text-lg font-bold">৳{product.productPrice.toLocaleString()}</span>
            )}
          </div>
          <div className="mt-1 text-xs text-gray-500 flex items-center justify-between">
            <span className="flex items-center gap-1"><Package className="w-3 h-3" /> {product.sellCount} sold</span>
            {product.rewardPoints > 0 && <span>+{product.rewardPoints} pts</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

function FilterSidebar({ filters }: { filters: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const current = Object.fromEntries(searchParams.entries());
  const appliedMin = current.priceMin ? Number(current.priceMin) : filters.priceRange.min;
  const appliedMax = current.priceMax ? Number(current.priceMax) : filters.priceRange.max;

  const [minPrice, setMinPrice] = useState(appliedMin.toString());
  const [maxPrice, setMaxPrice] = useState(appliedMax.toString());

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === value) params.delete(key);
    else params.set(key, value);
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  const applyPriceFilter = () => {
    let min = Number(minPrice) || filters.priceRange.min;
    let max = Number(maxPrice) || filters.priceRange.max;
    if (min > max) return;

    const params = new URLSearchParams(searchParams.toString());
    min > filters.priceRange.min ? params.set('priceMin', min.toString()) : params.delete('priceMin');
    max < filters.priceRange.max ? params.set('priceMax', max.toString()) : params.delete('priceMax');

    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  return (
    <div className="space-y-8">
      {searchParams.toString() && (
        <Button variant="ghost" size="sm" className="w-full text-blue-600" onClick={() => router.push(pathname)}>
          Clear All Filters
        </Button>
      )}

      {/* Brand Filter */}
      {filters.brands.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-4">Brand</h3>
          <div className="space-y-3">
            {filters.brands.map((b: string) => (
              <Label key={b} className="flex items-center gap-3 cursor-pointer">
                <Checkbox checked={current.brand === b} onCheckedChange={() => updateFilter('brand', b)} />
                <span>{b}</span>
              </Label>
            ))}
          </div>
        </div>
      )}

      {/* Size Filter */}
      {filters.sizes.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-4">Size</h3>
          <div className="space-y-3">
            {filters.sizes.map((sz: string) => (
              <Label key={sz} className="flex items-center gap-3 cursor-pointer">
                <Checkbox checked={current.size === sz} onCheckedChange={() => updateFilter('size', sz)} />
                <span>{sz}</span>
              </Label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Price Range</h3>
        <div className="px-2 mb-5">
          <Slider
            value={[appliedMin, appliedMax]}
            min={filters.priceRange.min}
            max={filters.priceRange.max}
            step={50}
            onValueChange={([min, max]) => {
              setMinPrice(min.toString());
              setMaxPrice(max.toString());
            }}
            onValueCommit={applyPriceFilter}
          />
        </div>
        <div className="flex items-center gap-3">
          <Input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min" className="text-sm" />
          <span>—</span>
          <Input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max" className="text-sm" />
          <Button size="sm" onClick={applyPriceFilter}>Go</Button>
        </div>
        <div className="mt-3 text-sm text-gray-600 flex justify-between">
          <span>৳{appliedMin.toLocaleString()}</span>
          <span>৳{appliedMax.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export default function ChildCategoryClient({ initialData }: { initialData: ChildCategoryData }) {
  const [isPending] = useTransition();
  const filters = extractFilters(initialData.products);

  return (
    <>
      {/* Custom Loading Bar – No shadcn Progress */}
      <div className={`fixed top-0 left-0 h-1 bg-gradient-to-r from-indigo-600 to-pink-600 z-50 transition-all duration-500 ${isPending ? 'w-full' : 'w-0'}`} />

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>{initialData.childCategory.name}</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-900 to-pink-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{initialData.childCategory.name}</h1>
            <p className="text-lg opacity-90">{initialData.totalProducts} Products</p>
          </div>
        </div>

        {/* Mobile Filter */}
        <div className="md:hidden sticky top-0 z-40 bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <span className="text-sm text-gray-600">Showing {initialData.products.length} products</span>
            <Sheet>
              <SheetTrigger asChild><Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" /> Filters</Button></SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader><SheetTitle>Filter Products</SheetTitle></SheetHeader>
                <FilterSidebar filters={filters} />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-80 flex-shrink-0">
              <div className="sticky top-4 bg-white rounded-xl shadow-md p-6 h-[calc(100vh-8rem)] overflow-y-auto">
                <h3 className="font-bold text-xl mb-6">Filters</h3>
                <FilterSidebar filters={filters} />
              </div>
            </aside>

            {/* Products */}
            <div className="flex-1">
              {initialData.products.length === 0 ? (
                <div className="text-center py-24">
                  <Package className="w-24 h-24 mx-auto text-gray-300 mb-6" />
                  <h3 className="text-2xl font-semibold text-gray-600">No products found</h3>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {initialData.products.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}