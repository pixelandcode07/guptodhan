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
                {[...Array(8)].map((_, i) => <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl" />)}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-3xl">
                No products found matching these filters.
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {products.map((p: any, i: number) => <ProductCardMotion key={p._id} product={p} index={i} />)}
            </div>
            
            {pagination.pages > 1 && (
                <div className="mt-12 flex justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <Button
                                    variant="ghost"
                                    disabled={pagination.page <= 1}
                                    // এখানে onPageChange কল হচ্ছে
                                    onClick={() => onPageChange(pagination.page - 1)}
                                >Previous</Button>
                            </PaginationItem>
                            
                            <PaginationItem>
                                <PaginationLink isActive className="rounded-lg shadow-sm">{pagination.page}</PaginationLink>
                            </PaginationItem>
                            
                            <PaginationItem>
                                <Button
                                    variant="ghost"
                                    disabled={pagination.page >= pagination.pages}
                                    // এখানে onPageChange কল হচ্ছে
                                    onClick={() => onPageChange(pagination.page + 1)}
                                >Next</Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </>
    );
}