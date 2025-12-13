export interface ChildCategory {
    childCategoryId: string;
    name: string;
    slug: string; // ✅ Added
}

export interface SubCategory {
    subCategoryId: string;
    name: string;
    slug: string; // ✅ Added
    children: ChildCategory[];
}

export interface MainCategory {
    mainCategoryId: string;
    name: string;
    slug: string; // ✅ Added
    subCategories: SubCategory[];
}

export interface ApiResponse {
    success: boolean;
    message: string;
    data: MainCategory[];
}