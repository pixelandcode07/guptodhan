'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious, PaginationLink } from '@/components/ui/pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCcw, Loader2, Package, Info, ShieldCheck, Star, Search, SlidersHorizontal, Palette, Ruler, Flag as FlagIcon } from 'lucide-react';
import ProductCardMotion from '@/components/ReusableComponents/ProductCardMotion';
import { Separator } from '@/components/ui/separator';
import FilterPanel from '../../components/FilterPanel';
import ProductTab from '../../components/StoreTabs/ProductTab';
import PoliciesTab from '../../components/StoreTabs/PoliciesTab';
import AboutTab from '../../components/StoreTabs/AboutTab';
import ReviewsTab from '../../components/StoreTabs/ReviewsTab';

// --- TYPESCRIPT INTERFACES ---

interface ProductOption {
    productImage: string;
    color: string[];
    size: string[];
    price: number;
    discountPrice: number;
    stock: number;
}

interface CategoryInfo {
    _id: string;
    name: string;
}

interface Product {
    _id: string;
    slug: string;
    productTitle: string;
    thumbnailImage: string;
    productPrice: number;
    discountPrice?: number;
    shortDescription: string;
    stock: number;
    brand?: { _id: string; name: string };
    flag?: { _id: string; name: string };
    category?: CategoryInfo;
    subCategory?: CategoryInfo;
    productOptions: ProductOption[];
    totalReviews: number;
    averageRating: number;
}

interface StoreData {
    _id: string;
    storeName: string;
    storeLogo: string;
    storeBanner: string;
    vendorShortDescription: string;
    fullDescription: string;
    storeAddress: string;
}

interface PaginationData {
    total: number;
    page: number;
    limit: number;
    pages: number;
}

interface StoreApiResponse {
    store: StoreData;
    productsWithReviews: Product[];
    pagination: PaginationData;
}

// --- MAIN COMPONENT ---

export default function StoreFront({
    initialData,
    storeId
}: {
    initialData: StoreApiResponse;
    storeId: string
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Data States
    const [products, setProducts] = useState<Product[]>(initialData?.productsWithReviews || []);
    const [pagination, setPagination] = useState<PaginationData>(initialData?.pagination || { total: 0, page: 1, limit: 20, pages: 1 });
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('products');

    // Filter States with proper types
    const [search, setSearch] = useState<string>(searchParams.get('search') || '');
    const [minPrice, setMinPrice] = useState<string>(searchParams.get('min') || '');
    const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('max') || '');
    const [selectedBrands, setSelectedBrands] = useState<string[]>(searchParams.get('brand')?.split(',').filter(Boolean) || []);
    const [selectedColors, setSelectedColors] = useState<string[]>(searchParams.get('color')?.split(',').filter(Boolean) || []);
    const [selectedSizes, setSelectedSizes] = useState<string[]>(searchParams.get('size')?.split(',').filter(Boolean) || []);
    const [selectedFlags, setSelectedFlags] = useState<string[]>(searchParams.get('flag')?.split(',').filter(Boolean) || []);
    const [sortBy, setSortBy] = useState<string>(searchParams.get('sortBy') || 'newest');

    // Filtering Options Extraction (Type Safe)
    const uniqueBrands = Array.from(new Set(initialData?.productsWithReviews?.map(p => p.brand?.name))).filter(Boolean) as string[];
    const uniqueColors = Array.from(new Set(initialData?.productsWithReviews?.flatMap(p => p.productOptions?.flatMap(opt => opt.color)))).filter(Boolean) as string[];
    const uniqueSizes = Array.from(new Set(initialData?.productsWithReviews?.flatMap(p => p.productOptions?.flatMap(opt => opt.size)))).filter(Boolean) as string[];
    const uniqueFlags = Array.from(new Set(initialData?.productsWithReviews?.map(p => p.flag?.name))).filter(Boolean) as string[];

    const fetchFilteredProducts = useCallback(async (overrides: Record<string, string | number> = {}) => {
        setIsLoading(true);
        const params = new URLSearchParams();

        const currentFilters: Record<string, string | number> = {
            search, min: minPrice, max: maxPrice, sortBy,
            brand: selectedBrands.join(','),
            color: selectedColors.join(','),
            size: selectedSizes.join(','),
            flag: selectedFlags.join(','),
            page: pagination.page,
            ...overrides
        };

        Object.keys(currentFilters).forEach(key => {
            if (currentFilters[key]) params.set(key, String(currentFilters[key]));
        });

        try {
            const res = await axios.get(`/api/v1/public/vendor-store/store-with-product/${storeId}?${params.toString()}`);
            if (res.data.success) {
                setProducts(res.data.data.productsWithReviews);
                setPagination(res.data.data.pagination);
                router.push(`?${params.toString()}`, { scroll: false });
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setIsLoading(false);
        }
    }, [search, minPrice, maxPrice, selectedBrands, selectedColors, selectedSizes, selectedFlags, sortBy, storeId, router, pagination.page]);

    // Apply sorting instantly
    useEffect(() => {
        if (sortBy) fetchFilteredProducts({ page: 1 });
    }, [sortBy]);

    const handleClear = () => {
        setSearch(''); setMinPrice(''); setMaxPrice('');
        setSelectedBrands([]); setSelectedColors([]); setSelectedSizes([]); setSelectedFlags([]);
        setSortBy('newest');
        router.push(window.location.pathname);
        setProducts(initialData?.productsWithReviews || []);
    };

    const commonFilterProps = {
        minPrice, setMinPrice, maxPrice, setMaxPrice,
        uniqueBrands, selectedBrands, setSelectedBrands,
        uniqueColors, selectedColors, setSelectedColors,
        uniqueSizes, selectedSizes, setSelectedSizes,
        uniqueFlags, selectedFlags, setSelectedFlags,
        handleClear,
        applyFilters: fetchFilteredProducts
    };


    return (
        <div className="max-w-[1440px] mx-auto pt-6 pb-20 px-0.5 md:px-4">
            {/* Header: Search & Sort */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border">
                <div className="relative w-full md:w-1/2 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200 z-10" />

                    <Input
                        placeholder="Search products in this store..."
                        className="pl-12 h-12 w-full bg-white border-2 border-slate-200 rounded-2xl shadow-sm transition-all duration-200 
                   placeholder:text-muted-foreground/60
                   hover:border-slate-300
                   focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchFilteredProducts({ page: 1 })}
                    />
                    {search && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-slate-200 shadow-sm">
                                ENTER
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="lg:hidden flex-1 h-12 rounded-xl"><SlidersHorizontal className="w-4 h-4 mr-2" /> Filters</Button>
                        </SheetTrigger>
                        <SheetContent side="left"><FilterPanel {...commonFilterProps} /></SheetContent>
                    </Sheet>

                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="flex-1 md:w-[200px] h-12 bg-muted/10 border-none rounded-xl">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="price-asc"><span className='hidden md:block'>Price:</span> Low to High</SelectItem>
                            <SelectItem value="price-desc"><span className='hidden md:block'>Price:</span> High to Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                <aside className="hidden lg:block sticky top-24 h-fit bg-white p-6 rounded-2xl border shadow-sm">
                    <FilterPanel {...commonFilterProps} />
                </aside>

                <main className="lg:col-span-3">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="bg-muted/20 p-1 rounded-xl h-auto flex flex-wrap justify-start gap-1">
                            <TabsTrigger value="products" className="px-6 py-2 rounded-lg data-[state=active]:bg-white shadow-none gap-2">
                                <Package className="w-4 h-4" /> Products ({pagination.total})
                            </TabsTrigger>
                            <TabsTrigger value="about" className="px-6 py-2 rounded-lg data-[state=active]:bg-white shadow-none gap-2">
                                <Info className="w-4 h-4" /> About
                            </TabsTrigger>
                            {/* <TabsTrigger value="policies" className="px-6 py-2 rounded-lg data-[state=active]:bg-white shadow-none gap-2">
                                <ShieldCheck className="w-4 h-4" /> Policies
                            </TabsTrigger> */}
                            <TabsTrigger value="reviews" className="px-6 py-2 rounded-lg data-[state=active]:bg-white shadow-none gap-2">
                                <Star className="w-4 h-4" /> Reviews
                            </TabsTrigger>
                        </TabsList>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <TabsContent value="products" className="m-0 focus-visible:ring-0">
                                    <ProductTab
                                        isLoading={isLoading}
                                        products={products}
                                        pagination={pagination}
                                        onPageChange={(page) => fetchFilteredProducts({ page })}
                                    />
                                </TabsContent>

                                <TabsContent value="about">
                                    <AboutTab store={initialData.store} />
                                </TabsContent>

                                <TabsContent value="policies">
                                    <PoliciesTab store={initialData.store} />
                                </TabsContent>

                                <TabsContent value="reviews">
                                    <ReviewsTab storeId={storeId} />
                                </TabsContent>
                            </motion.div>
                        </AnimatePresence>
                    </Tabs>
                </main>
            </div>
        </div>
    );
}