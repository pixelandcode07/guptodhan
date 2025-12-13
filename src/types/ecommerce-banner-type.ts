
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}


export interface EcommerceBannerType {
    _id: string;
    bannerImage: string;
    bannerPosition: 'left-homepage' | 'right-homepage' | 'bottom-homepage' | 'top-homepage' | 'middle-homepage' | 'top-shoppage';

    textPosition: 'left' | 'right';
    bannerLink?: string;
    subTitle?: string;
    bannerTitle: string;
    bannerDescription?: string;
    buttonText?: string;
    buttonLink?: string;
    status: 'active' | 'inactive';
}

export interface EcommerceSliderBannerType {
    _id: string;
    sliderId: string;
    image: string;
    textPosition: 'Left' | 'Right' | 'Center';
    sliderLink: string;
    subTitleWithColor: string;
    bannerTitleWithColor: string;
    bannerDescriptionWithColor: string;
    buttonWithColor: string;
    buttonLink: string;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
    __v: number;
}


