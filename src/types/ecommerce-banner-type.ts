
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}


export interface EcommerceBannerType {
    _id: string;
    bannerImage: string;
    bannerPosition: 'left-homepage' | 'right-homepage' | 'bottom-homepage';
    textPosition: 'left' | 'right';
    bannerLink?: string;
    subTitle?: string;
    bannerTitle: string;
    bannerDescription?: string;
    buttonText?: string;
    buttonLink?: string;
    status: 'active' | 'inactive';
}
