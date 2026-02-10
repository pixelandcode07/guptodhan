'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ChevronRight, MapPin, MoveLeft, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import axios from 'axios';

interface FilterData {
  subCategories: { _id: string; name: string; count: number }[];
  locations: { _id: string; name: string; count: number }[];
  brand: { _id: string; brand: string; count: number }[];
}

interface Ad {
  _id: string;
  title: string;
  price: number;
  images: string[];
  subCategory?: { name: string };
  district?: string;
  brand?: string;
  division?: string;
  upazila?: string;
  condition?: string;
}

interface Props {
  initialAds: Ad[];
  filters: FilterData;
  priceRange: { min: number; max: number };
  category: { name: string; adCount: number };
  categoryId: string;
}

export default function CategoryItemsClient({
  initialAds,
  filters,
  priceRange,
  category,
  categoryId,
}: Props) {
  const [ads, setAds] = useState<Ad[]>(initialAds);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedSubCats, setSelectedSubCats] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  
  // ✅ FIX: Initialize state with props directly to avoid jump
  const [price, setPrice] = useState([priceRange.min || 0, priceRange.max || 100000]); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sync price only if props change drastically (optional, mostly init is enough)
  useEffect(() => {
    if (priceRange.max > 0) {
        setPrice(prev => (prev[1] === 100000 && prev[0] === 0) ? [priceRange.min, priceRange.max] : prev);
    }
  }, [priceRange]);

  const applyFilters = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      // We are fetching via SLUG API usually, but if using Search API, we need category ID
      // But wait, the slug page controller handles filtering internally. 
      // Let's use the current page URL strategy if possible, OR standard search API.
      // Assuming we use the standard search API you have:
      if (categoryId) params.append('category', categoryId);

      // Arrays
      selectedSubCats.forEach(id => params.append('subCategory', id));
      selectedLocations.forEach(name => params.append('district', name));
      selectedBrands.forEach(name => params.append('brand', name));

      // Price
      params.append('minPrice', price[0].toString());
      params.append('maxPrice', price[1].toString());

      // 🔥 Call the SEARCH API (Make sure this API is robust as per step 2 & 3)
      const res = await axios.get(`/api/v1/public/classifieds/search?${params.toString()}`);
      
      setAds(res.data.data || []);
    } catch (error) {
      console.error('Filter error:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, categoryId, selectedSubCats, selectedLocations, selectedBrands, price]);

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => applyFilters(), 600);
    return () => clearTimeout(timer);
  }, [applyFilters]);

  const breadcrumb = ['Home', 'Buy & Sell', category.name];

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Price */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Price Range</h3>
        <Slider 
          value={price} 
          onValueChange={setPrice} 
          min={priceRange.min} 
          max={priceRange.max} 
          step={500} 
          className="mb-3" 
        />
        <div className="flex justify-between text-sm font-medium text-gray-600">
          <span>৳{price[0].toLocaleString()}</span>
          <span>৳{price[1].toLocaleString()}</span>
        </div>
      </div>

      {/* Sub Categories */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Sub Categories</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
          {filters.subCategories.length > 0 ? filters.subCategories.map(sub => (
            <Label key={sub._id} className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-600">
              <Checkbox
                checked={selectedSubCats.includes(sub._id)}
                onCheckedChange={(c) => {
                  if (c) setSelectedSubCats([...selectedSubCats, sub._id]);
                  else setSelectedSubCats(selectedSubCats.filter(id => id !== sub._id));
                }}
              />
              <span className="flex-1">{sub.name}</span>
              <span className="text-gray-400 text-xs">({sub.count})</span>
            </Label>
          )) : <p className="text-gray-400 text-sm">No sub-categories found</p>}
        </div>
      </div>

      {/* Brands */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Brand</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
          {filters.brand?.length > 0 ? filters.brand.map(b => (
            <Label key={b._id} className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-600">
              <Checkbox
                checked={selectedBrands.includes(b.brand)}
                onCheckedChange={(c) => {
                  if (c) setSelectedBrands([...selectedBrands, b.brand]);
                  else setSelectedBrands(selectedBrands.filter(brand => brand !== b.brand));
                }}
              />
              <span className="flex-1">{b.brand}</span>
              <span className="text-gray-400 text-xs">({b.count})</span>
            </Label>
          )) : <p className="text-gray-400 text-sm">No brands found</p>}
        </div>
      </div>

      {/* Locations */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Location</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
          {filters.locations.length > 0 ? filters.locations.map(loc => (
            <Label key={loc._id} className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-600">
              <Checkbox
                checked={selectedLocations.includes(loc.name)}
                onCheckedChange={(c) => {
                  if (c) setSelectedLocations([...selectedLocations, loc.name]);
                  else setSelectedLocations(selectedLocations.filter(l => l !== loc.name));
                }}
              />
              <span className="flex-1">{loc.name}</span>
              <span className="text-gray-400 text-xs">({loc.count})</span>
            </Label>
          )) : <p className="text-gray-400 text-sm">No locations found</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-3 text-xs sm:text-sm text-gray-600">
          <nav className="flex items-center gap-1 flex-wrap">
            {breadcrumb.map((crumb, i) => (
              <span key={crumb} className="flex items-center">
                {i > 0 && <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mx-1" />}
                {i === breadcrumb.length - 1 ? (
                  <span className="font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">{crumb}</span>
                ) : (
                  <Link href="#" className="hover:text-green-600 truncate">{crumb}</Link>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-6">
        {/* Mobile Filter Bar */}
        <div className="lg:hidden mb-4 bg-white p-3 rounded-lg shadow-sm">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-10 text-sm" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 relative">
                  <Filter className="w-4 h-4" />
                  {(selectedSubCats.length > 0 || selectedBrands.length > 0) && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto"><SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader><div className="mt-6"><FilterSidebar /></div></SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-4 lg:gap-6">
          <aside className="hidden lg:block w-80 flex-shrink-0 sticky top-24 h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide"><FilterSidebar /></aside>
          <main className="flex-1">
            {/* Desktop Search Bar */}
            <div className="hidden lg:flex justify-between items-center mb-4 bg-white p-3 rounded-lg shadow-sm">
              <div className="flex-1 max-w-xl mr-4">
                <div className="relative">
                  <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 h-11" />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                <Link href="/home/buyandsell" className="flex items-center"><MoveLeft className="w-5 h-5 mr-2" /> Back</Link>
              </Button>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl sm:text-2xl font-bold truncate text-gray-800">{category.name}</h1>
              <Badge variant="secondary" className="text-sm px-3 py-1">{loading ? 'Updating...' : `${ads.length} Ads`}</Badge>
            </div>

            {loading && ads.length === 0 ? <div className="text-center py-20">Loading ads...</div> : ads.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><Search className="w-8 h-8 text-gray-400" /></div>
                <h3 className="text-lg font-medium text-gray-900">No ads found</h3>
                <Button variant="link" onClick={() => { setSelectedSubCats([]); setSelectedBrands([]); setPrice([priceRange.min, priceRange.max]); }} className="mt-2 text-blue-600">Clear filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {ads.map(ad => (
                  <Link key={ad._id} href={`/home/buyandsell/ad-details/${ad._id}`} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 overflow-hidden group flex flex-col h-full">
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      <Image src={ad.images?.[0] || '/placeholder.png'} alt={ad.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide text-gray-700 shadow-sm">{ad.condition}</div>
                    </div>
                    <div className="p-3 flex flex-col flex-grow">
                      <h3 className="font-semibold text-sm line-clamp-2 mb-1 text-gray-800 group-hover:text-blue-600 transition-colors">{ad.title}</h3>
                      <div className="mt-auto space-y-2">
                        <div className="flex items-center justify-between">
                           {ad.brand && <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 truncate max-w-[80px]">{ad.brand}</span>}
                          <div className="flex items-center text-[11px] text-gray-500"><MapPin className="w-3 h-3 mr-0.5" /><span className="truncate max-w-[80px]">{ad.district}</span></div>
                        </div>
                        <p className="text-lg font-bold text-[#0097E9]">৳{ad.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}