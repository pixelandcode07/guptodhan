"use client"

import * as React from "react"
import { type CarouselApi } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import apiClient from "@/lib/axios"

// API Category Interface (matches your ecommerce category model)
interface ApiCategory {
    _id: string;
    categoryId: string;
    name: string;
    categoryIcon: string;
    categoryBanner?: string;
    isFeatured: boolean;
    isNavbar: boolean;
    slug: string;
    status: 'active' | 'inactive';
    createdAt: string;
}

// Component Category Interface (for display)
interface Category {
    name: string;
    imageUrl: string;
    href: string;
}

export function ShopByCategory() {
    const [carouselApi, setCarouselApi] = React.useState<CarouselApi>()
    const [categories, setCategories] = React.useState<Category[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    // Fetch featured categories from optimized endpoint
    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true)
                setError(null)
                
                // Use the new optimized featured categories endpoint
                const response = await apiClient.get('/ecommerce-category/ecomCategory/featured')
                const featuredCategories = response.data?.data || []
                
                // Transform API data to component format
                const transformedCategories: Category[] = featuredCategories.map((cat: ApiCategory) => ({
                    name: cat.name,
                    imageUrl: cat.categoryIcon || '/img/buysell/electronics.png', // fallback image
                    href: `/products?category=${cat.slug}` // link to products filtered by category
                }))
                
                setCategories(transformedCategories)
                
                // If no featured categories found, show a message
                if (transformedCategories.length === 0) {
                    setError('No featured categories found. Please mark some categories as featured.')
                }
                
            } catch (err) {
                console.error('Error fetching featured categories:', err)
                setError('Failed to load featured categories')
                // Remove mock data fallback; keep categories empty on error
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])


    // Loading state with skeleton
    if (loading) {
        return (
            <section className="w-full">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-[#0084CB]" />
                        <span className="ml-2 text-gray-600 text-sm">Loading categories...</span>
                    </div>
                    {/* Skeleton loader */}
                    <div className="flex justify-center gap-4 mt-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
                                <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    // No featured categories found
    if (categories.length === 0 && error) {
        return (
            <section className="w-full">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <p className="text-yellow-600 mb-2">{error}</p>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="w-full">
            <div className="container mx-auto px-4 md:px-6">
                {error && categories.length > 0 && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-yellow-800 text-sm">⚠️ {error}</p>
                    </div>
                )}
                
                <Carousel
                    setApi={setCarouselApi}
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full max-w-7xl mx-auto"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {categories.map((category, index) => (
                            <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/3 sm:basis-1/4 md:basis-1/6 lg:basis-[12.5%]">
                                <div className="p-1">
                                    <Link href={category.href} className="flex flex-col items-center justify-center gap-2 group">
                                        <div className="w-24 h-24 p-1 rounded-full transition-transform duration-300 group-hover:scale-110">
                                            <Image
                                                src={category.imageUrl}
                                                alt={`Image for ${category.name}`}
                                                width={200}
                                                height={200}
                                                className="rounded-full w-[92px] h-[92px] md:w-[95px] md:h-[92px] object-cover"
                                                onError={(e) => {
                                                    // Fallback to a default image if the original fails
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/img/buysell/electronics.png';
                                                }}
                                            />
                                        </div>
                                        <p className="text-sm font-medium text-center text-[#000000] transition-colors duration-300 group-hover:text-primary">
                                            {category.name}
                                        </p>
                                    </Link>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                
                {categories.length > 0 && (
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => carouselApi?.scrollPrev()}
                        >
                            <ArrowLeft className="text-[#0084CB]" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => carouselApi?.scrollNext()}
                        >
                            <ArrowRight className="text-[#0084CB]" />
                        </Button>
                    </div>
                )}
            </div>
        </section>
    )
}