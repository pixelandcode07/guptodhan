import { Document } from 'mongoose';

export interface IPKSlider extends Document {
  sliderId: string;
  image: string;
  textPosition: string;
  sliderLink: string;
  subTitleWithColor: string;
  bannerTitleWithColor: string;
  bannerDescriptionWithColor: string;
  buttonWithColor: string;
  buttonLink: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  orderCount: number;
}
