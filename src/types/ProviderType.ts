export interface IServiceProviderInfo {
    bio: string;
    subCategories: any[];
}

export interface IProvider {
    serviceProviderInfo: IServiceProviderInfo;
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    isDeleted: boolean;
    isVerified: boolean;
    isActive: boolean;
    role: 'service-provider'
    rewardPoints: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface IApiResponse {
    success: boolean;
    message: string;
    data: IProvider[];
}
