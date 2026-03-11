'use client';

import ProductCardMotion from "@/components/ReusableComponents/ProductCardMotion";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

interface ProductTabProps {
    isLoading: boolean;
    products: any[];
    pagination: {
        page: number;
        pages: number;
        total: number;
    };
    onPageChange: (page: number) => void;
}

export default function ProductTab({ isLoading, products, pagination, onPageChange }: ProductTabProps) {
    
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-72 bg-muted animate-pulse rounded-2xl" />
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-3xl bg-white">
                No products found matching these filters.
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* ✅ Responsive Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {products.map((p, i) => (
                    // ✅ All data including 'slug' is passed down to ProductCardMotion
                    <ProductCardMotion 
                        key={p._id} 
                        product={p} 
                        index={i} 
                    />
                ))}
            </div>
            
            {/* ✅ Enhanced Pagination */}
            {pagination.pages > 1 && (
                <div className="flex justify-center border-t pt-8">
                    <Pagination>
                        <PaginationContent className="gap-2">
                            <PaginationItem>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-lg"
                                    disabled={pagination.page <= 1}
                                    onClick={() => onPageChange(pagination.page - 1)}
                                >
                                    Previous
                                </Button>
                            </PaginationItem>
                            
                            <div className="flex items-center gap-1">
                                {[...Array(pagination.pages)].map((_, i) => (
                                    <PaginationItem key={i}>
                                        <Button
                                            variant={pagination.page === i + 1 ? "default" : "ghost"}
                                            size="sm"
                                            className="w-9 h-9 rounded-lg"
                                            onClick={() => onPageChange(i + 1)}
                                        >
                                            {i + 1}
                                        </Button>
                                    </PaginationItem>
                                ))}
                            </div>
                            
                            <PaginationItem>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-lg"
                                    disabled={pagination.page >= pagination.pages}
                                    onClick={() => onPageChange(pagination.page + 1)}
                                >
                                    Next
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
} 