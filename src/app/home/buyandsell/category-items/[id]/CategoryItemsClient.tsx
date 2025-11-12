'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ChevronRight, MapPin, MoveLeft, Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import axios from 'axios';

interface FilterData {
  subCategories: { name: string; count: number }[];
  locations: { name: string; count: number }[];
  brand: { brand: string; count: number }[];
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
  const [price, setPrice] = useState([priceRange.min, priceRange.max]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const applyFilters = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('title', searchTerm);
      if (categoryId) params.append('category', categoryId);
      selectedSubCats.forEach(name => params.append('subCategory', name));
      selectedLocations.forEach(name => params.append('district', name));
      selectedBrands.forEach(name => params.append('brand', name));
      if (price[0] > priceRange.min) params.append('minPrice', price[0].toString());
      if (price[1] < priceRange.max) params.append('maxPrice', price[1].toString());

      const res = await axios.get(`/api/v1/public/classifieds/search?${params.toString()}`);
      setAds(res.data.data || []);
    } catch (error) {
      console.error('Filter error:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, categoryId, selectedSubCats, selectedLocations, selectedBrands, price, priceRange]);

  useEffect(() => {
    const timer = setTimeout(() => applyFilters(), 500);
    return () => clearTimeout(timer);
  }, [applyFilters]);

  const breadcrumb = ['Home', 'Buy & Sell', category.name];

  // Filter Sidebar (Mobile + Desktop)
  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Price */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Price Range</h3>
        <Slider value={price} onValueChange={setPrice} min={priceRange.min} max={priceRange.max} step={1000} className="mb-3" />
        <div className="flex justify-between text-sm">
          <span>৳{price[0].toLocaleString()}</span>
          <span>—</span>
          <span>৳{price[1].toLocaleString()}</span>
        </div>
      </div>

      {/* Sub Categories */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Sub Categories</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {filters.subCategories.map(sub => (
            <Label key={sub.name} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={selectedSubCats.includes(sub.name)}
                onCheckedChange={(c) => {
                  if (c) setSelectedSubCats([...selectedSubCats, sub.name]);
                  else setSelectedSubCats(selectedSubCats.filter(s => s !== sub.name));
                }}
              />
              <span>{sub.name} ({sub.count})</span>
            </Label>
          ))}
        </div>
      </div>

      {/* Locations */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Location</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {filters.locations.map(loc => (
            <Label key={loc.name} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={selectedLocations.includes(loc.name)}
                onCheckedChange={(c) => {
                  if (c) setSelectedLocations([...selectedLocations, loc.name]);
                  else setSelectedLocations(selectedLocations.filter(l => l !== loc.name));
                }}
              />
              <span>{loc.name} ({loc.count})</span>
            </Label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Brand</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {filters.brand?.map(brandData => (
            <Label key={brandData.brand} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={selectedBrands.includes(brandData.brand)}
                onCheckedChange={(c) => {
                  if (c) setSelectedBrands([...selectedBrands, brandData.brand]);
                  else setSelectedBrands(selectedBrands.filter(b => b !== brandData.brand));
                }}
              />
              <span>{brandData.brand} ({brandData.count})</span>
            </Label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-2 text-xs sm:text-sm text-gray-600">
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
        {/* Mobile Header: Search + Filter Button */}
        <div className="lg:hidden mb-4 bg-white p-3 rounded-lg shadow-sm">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Filter className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterSidebar />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-4 lg:gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Desktop Search + Back Button */}
            <div className="hidden lg:flex justify-between items-center mb-4 bg-white p-3 rounded-lg shadow-sm">
              <div className="flex-1 max-w-xl mr-4">
                <div className="relative">
                  <Input
                    placeholder="Search in this category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>
              <Button variant="BlueBtn">
                <Link href="/home/buyandsell" className="flex items-center">
                  <MoveLeft className="w-5 h-5 mr-2" />
                  Back to Buy & Sell
                </Link>
              </Button>
            </div>

            {/* Title + Count */}
            <div className="flex justify-between items-center mb-3">
              <h1 className="text-xl sm:text-2xl font-bold truncate">{category.name}</h1>
              <p className="text-xs sm:text-sm text-gray-600">
                {loading ? 'Loading...' : `${ads.length} ads`}
              </p>
            </div>

            {/* Product Grid */}
            {ads.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No ads found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {ads.map(ad => (
                  <Link
                    key={ad._id}
                    href={`/home/buyandsell/ad-details/${ad._id}`}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col h-full"
                  >
                    {/* Image */}
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={ad.images?.[0] || '/placeholder.png'}
                        alt={ad.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                        {ad.condition}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 flex flex-col flex-grow">
                      <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-blue-400 transition">
                        {ad.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {ad.district}
                      </p>
                      {ad.brand && (
                        <Badge variant="secondary" className="text-xs mb-2 w-fit">
                          {ad.brand.name}
                        </Badge>
                      )}
                      <p className="text-lg font-bold text-[#0097E9] mt-auto">
                        ৳{ad.price.toLocaleString()}
                      </p>
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