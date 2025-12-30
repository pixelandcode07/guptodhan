// src/types/serviceCategory.types.ts

// Single Service Category interface
export interface IServiceCategory {
    _id: string;
    name: string;
    description: string;
    slug: string;
    icon_url: string;
    createdAt: string; 
    updatedAt: string;
    __v: number;
}

export interface ServiceCategoryResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: IServiceCategory;
}

export interface ServiceCategoriesResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: IServiceCategory[];
}

export interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}
