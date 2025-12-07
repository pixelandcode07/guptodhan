'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious, PaginationLink } from '@/components/ui/pagination';
import { Store, RotateCcw, Loader2, Filter as FilterIcon, X } from 'lucide-react';
import ProductCardMotion from '@/components/ReusableComponents/ProductCardMotion';

type Product = {
    _id: string;
    productTitle: string;
    thumbnailImage: string;
    productPrice: number;
    discountPrice?: number | null;
    shortDescription: string;
    stock: number;
    flag?: { name: string } | null;
    warranty?: { warrantyName: string } | null;
    rewardPoints?: number;
    brand?: { name: string } | null;
    productOptions: Array<{
        color?: string[];
        size?: string[];
        price: number;
        discountPrice?: number;
    }>;
};

export default function ProductGridWithFilters({
    initialProducts,
    storeId,
}: {
    initialProducts: Product[];
    storeId: string;
}) {
    const router = useRouter();
    const pathname = usePathname();

    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [isLoading, setIsLoading] = useState(false);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedFlags, setSelectedFlags] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const limit = 20;

    const allPrices = initialProducts.flatMap(p => p.productOptions.map(opt => opt.discountPrice || opt.price));
    const absoluteMin = Math.min(...allPrices);
    const absoluteMax = Math.max(...allPrices);

    const uniqueBrands = Array.from(new Set(initialProducts.flatMap(p => p.brand?.name || []))).filter(Boolean);
    const uniqueColors = Array.from(new Set(initialProducts.flatMap(p => p.productOptions.flatMap(opt => opt.color || [])))).filter(Boolean);
    const uniqueSizes = Array.from(new Set(initialProducts.flatMap(p => p.productOptions.flatMap(opt => opt.size || [])))).filter(Boolean);
    const uniqueFlags = Array.from(new Set(initialProducts.map(p => p.flag?.name).filter(Boolean)));

    const applyFilters = async (page = 1) => {
        setIsLoading(true);
        setCurrentPage(page);

        const params = new URLSearchParams();
        if (minPrice) params.set('min', minPrice);
        if (maxPrice) params.set('max', maxPrice);
        if (searchQuery) params.set('search', searchQuery);
        if (selectedBrands.length) params.set('brand', selectedBrands.join(','));
        if (selectedColors.length) params.set('color', selectedColors.join(','));
        if (selectedSizes.length) params.set('size', selectedSizes.join(','));
        if (selectedFlags.length) params.set('flag', selectedFlags.join(','));
        if (sortBy && sortBy !== 'newest') params.set('sortBy', sortBy);
        params.set('page', page.toString());
        params.set('limit', limit.toString());

        const query = params.toString();
        const url = query ? `?${query}` : '';

        try {
            const res = await axios.get(`/api/v1/public/vendor-store/storeWithProduct/${storeId}${url}`);
            if (res.data.success) {
                setProducts(res.data.data.products || []);
                router.replace(`${pathname}${url}`, { scroll: false });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
            setIsFilterOpen(false); // close drawer on mobile after apply
        }
    };

    const clearFilters = () => {
        setMinPrice('');
        setMaxPrice('');
        setSearchQuery('');
        setSelectedBrands([]);
        setSelectedColors([]);
        setSelectedSizes([]);
        setSelectedFlags([]);
        setSortBy('');
        setCurrentPage(1);
        setProducts(initialProducts);
        router.replace(pathname, { scroll: false });
        setIsFilterOpen(false);
    };

    const FilterContent = () => (
        <div className="space-y-6 pr-2">
            {/* Search */}
            <div className="space-y-2">
                <Label>Search</Label>
                <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                />
            </div>

            <Separator />

            {/* Price */}
            <div className="space-y-3">
                <Label>Price Range</Label>
                <div className="grid grid-cols-2 gap-3">
                    <Input
                        type="number"
                        placeholder={`৳${absoluteMin.toLocaleString()}`}
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <Input
                        type="number"
                        placeholder={`৳${absoluteMax.toLocaleString()}`}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </div>
            </div>

            {uniqueBrands.length > 0 && (
                <>
                    <Separator />
                    <div className="space-y-2">
                        <Label>Brands</Label>
                        {uniqueBrands.map(b => (
                            <label key={b} className="flex items-center gap-2">
                                <Checkbox
                                    checked={selectedBrands.includes(b)}
                                    onCheckedChange={(c) => setSelectedBrands(c ? [...selectedBrands, b] : selectedBrands.filter(x => x !== b))}
                                />
                                <span className="text-sm">{b}</span>
                            </label>
                        ))}
                    </div>
                </>
            )}

            {uniqueColors.length > 0 && (
                <>
                    <Separator />
                    <div className="space-y-2">
                        <Label>Colors</Label>
                        {uniqueColors.map(c => (
                            <label key={c} className="flex items-center gap-2">
                                <Checkbox
                                    checked={selectedColors.includes(c)}
                                    onCheckedChange={(v) => setSelectedColors(v ? [...selectedColors, c] : selectedColors.filter(x => x !== c))}
                                />
                                <span className="text-sm capitalize">{c}</span>
                            </label>
                        ))}
                    </div>
                </>
            )}

            {uniqueSizes.length > 0 && (
                <>
                    <Separator />
                    <div className="space-y-2">
                        <Label>Sizes</Label>
                        {uniqueSizes.map(s => (
                            <label key={s} className="flex items-center gap-2">
                                <Checkbox
                                    checked={selectedSizes.includes(s)}
                                    onCheckedChange={(v) => setSelectedSizes(v ? [...selectedSizes, s] : selectedSizes.filter(x => x !== s))}
                                />
                                <span className="text-sm">{s}</span>
                            </label>
                        ))}
                    </div>
                </>
            )}

            {uniqueFlags.length > 0 && (
                <>
                    <Separator />
                    <div className="space-y-2">
                        <Label>Flags</Label>
                        {uniqueFlags.map(f => (
                            <label key={f} className="flex items-center gap-2">
                                <Checkbox
                                    checked={selectedFlags.includes(f)}
                                    onCheckedChange={(v) => setSelectedFlags(v ? [...selectedFlags, f] : selectedFlags.filter(x => x !== f))}
                                />
                                <span className="text-sm">{f}</span>
                            </label>
                        ))}
                    </div>
                </>
            )}

            <Separator />

            <div className="space-y-3">
                <Label>Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                        <SelectValue placeholder="Newest first" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex gap-3 pt-4">
                <Button onClick={() => applyFilters(1)} className="flex-1" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Apply
                </Button>
                <Button variant="outline" onClick={clearFilters} className="flex-1">
                    Clear All
                </Button>
            </div>
        </div>
    );

    return (
        <div className="max-w-[95vw] xl:max-w-[90vw] mx-auto pt-10">
            {/* Mobile: Search + Filter Button */}
            <div className="flex gap-3 mb-6 lg:hidden">
                <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                    className="flex-1"
                />
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <FilterIcon className="w-5 h-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 overflow-y-auto">
                        <SheetHeader className="mb-6">
                            <SheetTitle className="flex items-center justify-between">
                                Filters
                                <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(false)}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </SheetTitle>
                        </SheetHeader>
                        <FilterContent />
                    </SheetContent>
                </Sheet>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block space-y-8">
                    <Card className="p-6 sticky top-24">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <FilterIcon className="w-5 h-5" />
                                Filters
                            </h3>
                            <Button variant="ghost" size="sm" onClick={clearFilters}>
                                <RotateCcw className="w-4 h-4 mr-1" />
                                Clear
                            </Button>
                        </div>
                        <FilterContent />
                    </Card>
                </aside>

                {/* Product Grid */}
                <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">
                            Products ({products.length})
                        </h2>
                        {isLoading && (
                            <span className="text-sm text-muted-foreground flex items-center">
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Updating...
                            </span>
                        )}
                    </div>

                    {products.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-20 text-muted-foreground">
                                No products found
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((p, i) => (
                                <ProductCardMotion key={p._id} product={p} index={i} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    <Pagination className="mt-10">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); if (currentPage > 1) applyFilters(currentPage - 1); }}
                                />
                            </PaginationItem>
                            <PaginationItem><PaginationLink isActive>{currentPage}</PaginationLink></PaginationItem>
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); if (products.length === limit) applyFilters(currentPage + 1); }}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}