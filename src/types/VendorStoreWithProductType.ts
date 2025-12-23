// Main response structure
export interface VendorStoreWithProductType {
    success: boolean;
    message: string;
    data: {
        store: Store;
        products: Product[];
    };
}

// Store details
export interface Store {
    storeSocialLinks: {
        facebook: string;
        whatsapp: string;
        instagram: string;
        linkedIn: string;
        twitter: string;
        tiktok: string;
    };
    _id: string;
    vendorId: string;
    storeLogo: string;
    storeBanner: string;
    storeName: string;
    storeAddress: string;
    storePhone: string;
    storeEmail: string;
    vendorShortDescription: string;
    fullDescription: string;
    commission: number;
    storeMetaTitle: string;
    storeMetaKeywords: string[];
    storeMetaDescription: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

// Product details
export interface Product {
    _id: string;
    productId: string;
    productTitle: string;
    vendorStoreId: string;
    vendorName: string;
    shortDescription: string;
    fullDescription: string;
    specification: string;
    warrantyPolicy: string;
    productTag: string[];
    videoUrl: string;
    photoGallery: string[];
    thumbnailImage: string;
    productPrice: number;
    discountPrice: number;
    stock: number;
    sku: string;
    rewardPoints: number;
    category: string;
    brand: string;
    flag: string;
    warranty: string;
    weightUnit: string;
    metaTitle: string;
    metaKeyword: string;
    metaDescription: string;
    status: string;
    sellCount: number;
    productOptions: ProductOption[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface ProductOption {
    productImage: string;
    unit: string[];
    simType: string[];
    condition: string[];
    warranty: string;
    stock: number;
    price: number;
    discountPrice: number;
    color: string[];
    size: string[];
}