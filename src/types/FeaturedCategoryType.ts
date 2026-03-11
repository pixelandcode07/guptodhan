export interface FeaturedCategory {
    _id: string;
    name: string;
    categoryIcon: string;
    isFeatured?: boolean;
    slug: string;
    status?: string;
    categoryId?: string;
    type?: string; // 👇 এই নতুন ফিল্ডটি যোগ করা হলো
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface FeatureProps {
    featuredData: FeaturedCategory[];
}