
export interface IServiceBanner {
  _id: string;
  bannerImage: string;
  bannerLink?: string;
  subTitle?: string;
  bannerTitle: string;
  bannerDescription?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}