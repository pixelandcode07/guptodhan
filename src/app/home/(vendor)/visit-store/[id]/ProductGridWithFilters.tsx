'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Package, Info, Star, Search, SlidersHorizontal, X
} from 'lucide-react';
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

export default function ProductGridWithFilters({
    initialData,
    storeId
}: {
    initialData: StoreApiResponse;
    storeId: string;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Data States
    const [products, setProducts] = useState<Product[]>(initialData?.productsWithReviews || []);
    const [pagination, setPagination] = useState<PaginationData>(
        initialData?.pagination || { total: 0, page: 1, limit: 20, pages: 1 }
    );
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('products');

    // Filter States
    const [search, setSearch] = useState<string>(searchParams.get('search') || '');
    const [minPrice, setMinPrice] = useState<string>(searchParams.get('min') || '');
    const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('max') || '');
    const [selectedBrands, setSelectedBrands] = useState<string[]>(
        searchParams.get('brand')?.split(',').filter(Boolean) || []
    );
    const [selectedColors, setSelectedColors] = useState<string[]>(
        searchParams.get('color')?.split(',').filter(Boolean) || []
    );
    const [selectedSizes, setSelectedSizes] = useState<string[]>(
        searchParams.get('size')?.split(',').filter(Boolean) || []
    );
    const [selectedFlags, setSelectedFlags] = useState<string[]>(
        searchParams.get('flag')?.split(',').filter(Boolean) || []
    );
    const [sortBy, setSortBy] = useState<string>(searchParams.get('sortBy') || 'newest');

    // ✅ Track if sortBy actually changed (not initial mount)
    const isSortMounted = useRef(false);

    // Unique filter options from initial data
    const uniqueBrands = Array.from(
        new Set(initialData?.productsWithReviews?.map(p => p.brand?.name))
    ).filter(Boolean) as string[];
    const uniqueColors = Array.from(
        new Set(initialData?.productsWithReviews?.flatMap(p =>
            p.productOptions?.flatMap(opt => opt.color)
        ))
    ).filter(Boolean) as string[];
    const uniqueSizes = Array.from(
        new Set(initialData?.productsWithReviews?.flatMap(p =>
            p.productOptions?.flatMap(opt => opt.size)
        ))
    ).filter(Boolean) as string[];
    const uniqueFlags = Array.from(
        new Set(initialData?.productsWithReviews?.map(p => p.flag?.name))
    ).filter(Boolean) as string[];

    // ===================================================================
    // ✅ Core fetch function — all filters + pagination
    // ===================================================================
    const fetchFilteredProducts = useCallback(async (
        overrides: Record<string, string | number> = {}
    ) => {
        setIsLoading(true);
        const params = new URLSearchParams();

        const currentFilters: Record<string, string | number> = {
            search,
            min: minPrice,
            max: maxPrice,
            sortBy,
            brand: selectedBrands.join(','),
            color: selectedColors.join(','),
            size: selectedSizes.join(','),
            flag: selectedFlags.join(','),
            page: pagination.page,
            ...overrides,
        };

        Object.keys(currentFilters).forEach(key => {
            if (currentFilters[key]) params.set(key, String(currentFilters[key]));
        });

        try {
            const res = await axios.get(
                `/api/v1/public/vendor-store/store-with-product/${storeId}?${params.toString()}`
            );
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
    }, [
        search, minPrice, maxPrice, selectedBrands, selectedColors,
        selectedSizes, selectedFlags, sortBy, storeId, router, pagination.page
    ]);

    // ✅ Sort change — skip initial mount to prevent page reset
    useEffect(() => {
        if (!isSortMounted.current) {
            isSortMounted.current = true;
            return;
        }
        fetchFilteredProducts({ page: 1 });
    }, [sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

    // ===================================================================
    // Clear all filters
    // ===================================================================
    const handleClear = () => {
        setSearch('');
        setMinPrice('');
        setMaxPrice('');
        setSelectedBrands([]);
        setSelectedColors([]);
        setSelectedSizes([]);
        setSelectedFlags([]);
        setSortBy('newest');
        router.push(window.location.pathname);
        setProducts(initialData?.productsWithReviews || []);
        setPagination(initialData?.pagination || { total: 0, page: 1, limit: 20, pages: 1 });
    };

    const commonFilterProps = {
        minPrice, setMinPrice,
        maxPrice, setMaxPrice,
        uniqueBrands, selectedBrands, setSelectedBrands,
        uniqueColors, selectedColors, setSelectedColors,
        uniqueSizes, selectedSizes, setSelectedSizes,
        uniqueFlags, selectedFlags, setSelectedFlags,
        handleClear,
        applyFilters: fetchFilteredProducts,
    };

    return (
        <div className="max-w-[1440px] mx-auto pt-6 pb-20 px-0.5 md:px-4">

            {/* ================================================================
                SEARCH & SORT BAR
            ================================================================ */}
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-8 bg-white p-3 rounded-2xl shadow-sm border">

                {/* ✅ Search Input */}
                <div className="relative w-full md:flex-1 group">
                    <Search
                        className={`
                            absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4
                            transition-colors duration-200 pointer-events-none z-10
                            ${search ? 'text-[#0097E9]' : 'text-gray-400 group-focus-within:text-[#0097E9]'}
                        `}
                    />
                    <input
                        type="text"
                        placeholder="Search products in this store..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') fetchFilteredProducts({ page: 1 });
                        }}
                        className="
                            w-full h-11 pl-10 pr-24
                            rounded-xl border border-gray-200
                            text-sm text-[#00005E] placeholder-gray-400
                            bg-gray-50 focus:bg-white
                            outline-none
                            transition-all duration-200
                            focus:border-[#0097E9] focus:shadow-[0_0_0_3px_rgba(0,151,233,0.10)]
                            hover:border-gray-300
                        "
                    />

                    {/* Right side of input: hint + clear */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                        {search ? (
                            <>
                                {/* Clear button */}
                                <button
                                    onClick={() => {
                                        setSearch('');
                                        fetchFilteredProducts({ page: 1, search: '' });
                                    }}
                                    className="p-1 rounded-full text-gray-400 hover:text-[#0097E9] hover:bg-[#0097E9]/10 transition-all"
                                    aria-label="Clear search"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                                {/* Search button */}
                                <button
                                    onClick={() => fetchFilteredProducts({ page: 1 })}
                                    className="px-3 h-7 rounded-lg bg-[#0097E9] hover:bg-[#007ec5] text-white text-xs font-medium transition-all active:scale-95"
                                >
                                    Search
                                </button>
                            </>
                        ) : (
                            <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                                ENTER
                            </span>
                        )}
                    </div>
                </div>

                {/* Sort + Mobile Filter */}
                <div className="flex gap-2 w-full md:w-auto shrink-0">
                    {/* Mobile filter sheet */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                className="lg:hidden flex-1 h-11 rounded-xl border-gray-200 text-sm"
                            >
                                <SlidersHorizontal className="w-4 h-4 mr-2" />
                                Filters
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <FilterPanel {...commonFilterProps} />
                        </SheetContent>
                    </Sheet>

                    {/* Sort dropdown */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="flex-1 md:w-[180px] h-11 rounded-xl border-gray-200 bg-gray-50 text-sm">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="price-asc">Price: Low to High</SelectItem>
                            <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* ================================================================
                MAIN LAYOUT: Sidebar Filter + Tabs
            ================================================================ */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Desktop Filter Sidebar */}
                <aside className="hidden lg:block sticky top-24 h-fit bg-white p-6 rounded-2xl border shadow-sm">
                    <FilterPanel {...commonFilterProps} />
                </aside>

                {/* Main Content */}
                <main className="lg:col-span-3">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="bg-muted/20 p-1 rounded-xl h-auto flex flex-wrap justify-start gap-1">
                            <TabsTrigger
                                value="products"
                                className="px-5 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#0097E9] gap-2 text-sm"
                            >
                                <Package className="w-4 h-4" />
                                Products ({pagination.total})
                            </TabsTrigger>
                            <TabsTrigger
                                value="about"
                                className="px-5 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#0097E9] gap-2 text-sm"
                            >
                                <Info className="w-4 h-4" />
                                About
                            </TabsTrigger>
                            <TabsTrigger
                                value="reviews"
                                className="px-5 py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#0097E9] gap-2 text-sm"
                            >
                                <Star className="w-4 h-4" />
                                Reviews
                            </TabsTrigger>
                        </TabsList>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
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