import { z } from 'zod';

// Create PK Slider validation
export const createPKSliderValidationSchema = z.object({
  sliderId: z.string().min(1, { message: 'Slider ID is required.' }),
  image: z.string().min(1, { message: 'Image is required.' }),
  textPosition: z.string().min(1, { message: 'Text position is required.' }),
  sliderLink: z.string().min(1, { message: 'Slider link is required.' }),
  subTitleWithColor: z.string().min(1, { message: 'SubTitle with color is required.' }),
  bannerTitleWithColor: z.string().min(1, { message: 'Banner title with color is required.' }),
  bannerDescriptionWithColor: z.string().min(1, { message: 'Banner description with color is required.' }),
  buttonWithColor: z.string().min(1, { message: 'Button with color is required.' }),
  buttonLink: z.string().min(1, { message: 'Button link is required.' }),
  status: z.enum(['active', 'inactive']).optional(),
  createdAt: z.date().optional(),
  orderCount: z.number().optional(),
});

// Update PK Slider validation
export const updatePKSliderValidationSchema = z.object({
  sliderId: z.string().optional(),
  image: z.string().optional(),
  textPosition: z.string().optional(),
  sliderLink: z.string().optional(),
  subTitleWithColor: z.string().optional(),
  bannerTitleWithColor: z.string().optional(),
  bannerDescriptionWithColor: z.string().optional(),
  buttonWithColor: z.string().optional(),
  buttonLink: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  createdAt: z.date().optional(),
  orderCount: z.number().optional(),
});
