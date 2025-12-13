export interface BannerDataType {
    _id: string;
    bannerImage: string;
    bannerDescription?: string;
    status: 'active' | 'inactive';
}

export interface BuyandSellApiResponse {
    success: boolean;
    message: string;
    data: BannerDataType[];
}