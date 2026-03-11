import z from "zod";

export const createPKSliderValidationSchema = z.object({
  sliderId: z.string().min(1, 'Slider ID is required'),
  image: z.string().min(1, 'Image is required'),
  textPosition: z.string().min(1, 'Text position is required'),
  
  sliderLink: z.string().url('Invalid web link URL'),
  
  // ✅ Made Links and Text Optional, allowing empty strings
  buttonLink: z.string().url('Invalid button link URL').optional().or(z.literal('')),
  
  appRedirectType: z.enum(['Product', 'Category', 'Brand', 'Shop', 'ExternalUrl', 'None']).default('None'),
  appRedirectId: z.string().optional().nullable(),

  actionStatus: z.enum(['product', 'category', 'store', 'none']).default('none'),
  productId: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  store: z.string().optional().nullable(),
  
  bannerTitleWithColor: z.string().min(1, 'Banner title is required'), // 🔴 Still Mandatory
  subTitleWithColor: z.string().optional().or(z.literal('')),          // ✅ Optional
  bannerDescriptionWithColor: z.string().optional().or(z.literal('')), // ✅ Optional
  buttonWithColor: z.string().optional().or(z.literal('')),            // ✅ Optional
  
  status: z.enum(['active', 'inactive']).default('active'),
});

export const updatePKSliderValidationSchema = createPKSliderValidationSchema.partial();