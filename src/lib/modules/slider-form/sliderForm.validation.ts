import z from "zod";

export const createPKSliderValidationSchema = z.object({
  sliderId: z.string().min(1, 'Slider ID is required'),
  image: z.string().min(1, 'Image is required'),
  textPosition: z.string().min(1, 'Text position is required'),
  
  sliderLink: z.string().url('Invalid web link URL'),
  buttonLink: z.string().url('Invalid button link URL'),
  
  // 🆕 App Navigation Validation
  appRedirectType: z.enum(['Product', 'Category', 'Brand', 'Shop', 'ExternalUrl', 'None']).default('None'),
  appRedirectId: z.string().optional().nullable(),
  
  subTitleWithColor: z.string().min(1, 'Sub title is required'),
  bannerTitleWithColor: z.string().min(1, 'Banner title is required'),
  bannerDescriptionWithColor: z.string().min(1, 'Banner description is required'),
  buttonWithColor: z.string().min(1, 'Button text is required'),
  
  status: z.enum(['active', 'inactive']).default('active'),
});

export const updatePKSliderValidationSchema = createPKSliderValidationSchema.partial();
