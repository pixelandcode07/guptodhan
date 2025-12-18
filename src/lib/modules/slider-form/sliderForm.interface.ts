export interface IPKSlider {
  _id?: string;
  sliderId: string;
  image: string;
  textPosition: string;

  // Web
  sliderLink: string;
  buttonLink: string;

  // App Navigation
  appRedirectType?: 'Product' | 'Category' | 'Brand' | 'Shop' | 'ExternalUrl' | 'None';
  // 🔥 FIX: null এবং undefined দুইটাই এলাউ করা হয়েছে
  appRedirectId?: string | null;

  // অ্যাপ ডেভেলপারের জন্য ফিল্ডস
  actionStatus: 'product' | 'category' | 'store' | 'none';
  productId?: string | null;
  category?: string | null;
  store?: string | null;

  subTitleWithColor: string;
  bannerTitleWithColor: string;
  bannerDescriptionWithColor: string;
  buttonWithColor: string;

  status?: 'active' | 'inactive';
  orderCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}