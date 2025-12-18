export interface ChildCategory {
    childCategoryId: string;
    name: string;
    slug: string; // ✅ Added
}

export interface SubCategory {
    subCategoryId: string;
    name: string;
    slug: string;
    children: ChildCategory[];
}

export interface MainCategory {
    mainCategoryId: string;
    categoryIcon: string;
    name: string;
    slug: string;
    subCategories: SubCategory[];
}

export interface ApiResponse {
    success: boolean;
    message: string;
    data: MainCategory[];
}