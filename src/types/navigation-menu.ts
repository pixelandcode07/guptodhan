export interface ChildCategory {
    childCategoryId: string;
    name: string;
}

export interface SubCategory {
    subCategoryId: string;
    name: string;
    children: ChildCategory[];
}

export interface MainCategory {
    mainCategoryId: string;
    name: string;
    subCategories: SubCategory[];
}

export interface ApiResponse {
    success: boolean;
    message: string;
    data: MainCategory[];
}