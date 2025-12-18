export interface IPKSlider {
  _id?: string;
  sliderId: string;
  image: string;
  textPosition: string;
  
  // Web
  sliderLink: string;
  buttonLink: string;
  
  // App
  appRedirectType?: 'Product' | 'Category' | 'Brand' | 'Shop' | 'ExternalUrl' | 'None';
  appRedirectId?: string;
  
  subTitleWithColor: string;
  bannerTitleWithColor: string;
  bannerDescriptionWithColor: string;
  buttonWithColor: string;
  
  status?: string;
  orderCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}